package com.beebook.beebookproject.service;

import com.beebook.beebookproject.dto.StripeChargeDto;
import com.beebook.beebookproject.dto.StripeTokenDto;
import com.beebook.beebookproject.entities.Book;
import com.beebook.beebookproject.entities.PointTransaction;
import com.beebook.beebookproject.entities.TransactionType;
import com.beebook.beebookproject.entities.User;
import com.beebook.beebookproject.payloads.ApiResponse;
import com.beebook.beebookproject.repositories.BookRepository;
import com.beebook.beebookproject.repositories.PointTransactionRepository;
import com.beebook.beebookproject.repositories.UserRepository;
import com.beebook.beebookproject.sec.StripeConfig;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.Instant;
import java.time.YearMonth;
import java.util.*;

@Service
@Slf4j
public class StripeService {
    @Autowired
    PointTransactionRepository pointTransactionRepository;
    @Autowired
    PointTransactionService pointTransactionService;
    @Autowired
    BookRepository bookRepository;
    @Autowired
    UserRepository userRepository;


    @PostConstruct
    public void init(){
        Stripe.apiKey = StripeConfig.getStripeApiKey();
    }

    public ResponseEntity<?> createCardToken(StripeTokenDto model) {
        Stripe.apiKey = StripeConfig.getStripePublishableKey();
        try {
            if (!isValidCardNumber(model.getCardNumber())) {
                throw new IllegalArgumentException("Invalid card number.");
            }
            int expMonth = Integer.parseInt(model.getExpMonth());
            int expYear = Integer.parseInt(model.getExpYear());

            if (expMonth < 1 || expMonth > 12) {
                throw new IllegalArgumentException("Invalid expiration month. Must be between 01 and 12.");
            }

            int currentYear = Calendar.getInstance().get(Calendar.YEAR) % 100;
            int currentMonth = YearMonth.now().getMonthValue();
            if (expYear < currentYear || (expYear == currentYear && expMonth < currentMonth)) {
                throw new IllegalArgumentException("Card has expired.");
            }
            if (expYear >= 75) {
                throw new IllegalArgumentException("Card year is invalid.");
            }
            Map<String, Object> card = new HashMap<>();
            card.put("number", model.getCardNumber());
            card.put("exp_month", Integer.parseInt(model.getExpMonth()));
            card.put("exp_year", Integer.parseInt(model.getExpYear()));
            card.put("cvc", model.getCvc());
            Map<String, Object> params = new HashMap<>();
            params.put("card", card);
            Token token = Token.create(params);
            if (token != null && token.getId() != null) {
                model.setSuccess(true);
                model.setToken(token.getId());
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(model);
        } catch (StripeException e) {
            log.error("StripeService (createCardToken)", e);
            throw new RuntimeException(e.getMessage());
        }catch (IllegalArgumentException e) {
            ApiResponse apiResponse = new ApiResponse(false, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }
    // Thuat Toan Luhn
    private boolean isValidCardNumber(String cardNumber) {
        int sum = 0;
        boolean alternate = false;
        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int digit = Character.getNumericValue(cardNumber.charAt(i));
            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
            alternate = !alternate;
        }
        return sum % 10 == 0;
    }


    public ResponseEntity<?> charge(StripeChargeDto chargeRequest) {
        Stripe.apiKey = StripeConfig.getStripeApiKey();
        try {
            if (chargeRequest.getAmount() < 0) {
                throw new IllegalArgumentException("Amount must be greater than or equal to 0.");
            }
            chargeRequest.setSuccess(false);
            String userName = chargeRequest.getUsername();
            Map<String, Object> chargeParams = new HashMap<>();
            chargeParams.put("amount", (int) (chargeRequest.getAmount() * 100));
            chargeParams.put("currency", "USD");
            chargeParams.put("description", "Payment for id " + chargeRequest.getAdditionalInfo().getOrDefault("ID_TAG", ""));
            chargeParams.put("source", chargeRequest.getStripeToken());
            Map<String, Object> metaData = new HashMap<>();
            metaData.put("id", chargeRequest.getChargeId());
            metaData.putAll(chargeRequest.getAdditionalInfo());
            chargeParams.put("metadata", metaData);
            Charge charge = Charge.create(chargeParams);
            chargeRequest.setMessage(charge.getOutcome().getSellerMessage());
            if (charge.getPaid()) {
                List<Object[]> users = pointTransactionRepository.fineTransactionByUserName(userName);
                User user = new User();
                user.setId((long) users.getFirst()[0]);
                System.out.println("user Id" + user.getId());
                PointTransaction pointTransaction = new PointTransaction();
                pointTransaction.setIdTransaction(UUID.randomUUID().toString());
                pointTransaction.setTransactionType(new TransactionType(1L, ""));
                pointTransaction.setPointsAdded((long) (chargeRequest.getAmount()*100 ));
                pointTransaction.setTransactionDate(java.sql.Date.from(Instant.now()));
                pointTransaction.setUser(user);
                System.out.println("Id:" + users.getFirst()[0]);
                pointTransactionRepository.save(pointTransaction);
                chargeRequest.setChargeId(charge.getId());
                chargeRequest.setSuccess(true);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(chargeRequest);
        } catch (StripeException e) {
            log.error("StripeService (charge)", e);
            throw new RuntimeException(e.getMessage());
        }catch (IllegalArgumentException e) {
            ApiResponse apiResponse = new ApiResponse(false, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }
    public ResponseEntity<?> buy(Long bookId, String username){
        Book book = bookRepository.findById(bookId).orElse(null);
        if (book == null) {
            return ResponseEntity.badRequest().body("Book not found");
        }
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        Optional<Object[]> checkIsExistedRental = Optional.ofNullable(userRepository.checkIsExistedRental(user.getId(), bookId));
        if(checkIsExistedRental.get().length > 0){
            return ResponseEntity.badRequest().body("Book have been purchased");

        }
        if (user.getPoint() >= book.getPointPrice()) {
            String userName = user.getUsername();
            List<Object[]> users = pointTransactionRepository.fineTransactionByUserName(userName);
            user.setId((long) users.getFirst()[0]);
            PointTransaction pointTransaction = new PointTransaction();
            pointTransaction.setIdTransaction(UUID.randomUUID().toString());
            pointTransaction.setTransactionType(new TransactionType(2L, ""));
            pointTransaction.setPointsAdded((book.getPointPrice()));
            pointTransaction.setTransactionDate(Date.from(Instant.now()));
            pointTransaction.setUser(user);
            pointTransactionRepository.save(pointTransaction);
            userRepository.addRentalReceipt(user.getId(), bookId, book.getPointPrice());
            return ResponseEntity.ok("User has enough points to purchase this book");
        } else {
            return ResponseEntity.badRequest().body("User does not have enough points to purchase this book");
        }
    }
}

