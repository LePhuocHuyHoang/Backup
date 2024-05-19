package com.beebook.beebookproject.repositories;

import com.beebook.beebookproject.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;


@Repository
public interface UserRepository extends JpaRepository<User,Long>{
    @Modifying
    @Query(value = "EXEC deleteComment @commentId = :commentId", nativeQuery = true)
    void deleteComment(@Param("commentId") Long commentId);
    @Procedure(name = "CheckCommentExists", outputParameterName = "Exists")
    boolean existsById(@Param("commentId") Long commentId);
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.id = :userId")
    boolean existsUserById(@Param("userId") Long userId);
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.username = :userName")
    boolean existsUserByUserName(@Param("userName") String userName);
    @Modifying
    @Transactional
    @Query(value = "EXEC deleteUserByUserName :userName", nativeQuery = true)
    void deleteUserByUserName(@Param("userName")String userName);
    @Modifying
    @Transactional
    @Query(value = "exec getRentedBook :userId, :month, :year, :offset, :fetch", nativeQuery = true)
    List<Object[]> getRentedBook(
            @Param("userId") Long userId,
            @Param("month") Long month,
            @Param("year") Long year,
            @Param("offset") Long offset,
            @Param("fetch") Long fetch
    );

    User findByUsername(String userName);
    User findByEmail(String email);

    @Transactional
    @Query(value = "EXEC getUserRating :userId, :bookId", nativeQuery = true)
    Object[] getUserRating(@Param("userId")Long userId, @Param("bookId")Long bookId);

    @Query(value = "exec getBookmark :userId, :offset, :fetch", nativeQuery = true)
    List<Map<String, Object>> getBookmark(@Param("userId") Long userId, @Param("offset") Long offset, @Param("fetch") Long fetch);

    @Modifying
    @Transactional
    @Query(value = "select username, first_name, last_name, DOB, point, gender, email from [user] where username = :userName", nativeQuery = true)
    List<Object[]> getProfile(@Param("userName") String userName);

    @Modifying
    @Transactional
    @Query(value = "insert into rental_receipt values(:userId, :bookId, GETDATE(), :pointPrice)", nativeQuery = true)
    void addRentalReceipt(@Param("userId") Long userId,@Param("bookId") Long bookId,@Param("pointPrice") Long pointPrice);

    @Modifying
    @Transactional
    @Query(value = "select * from rental_receipt where user_id = :userId and book_id = :bookId", nativeQuery = true)
    Object[] checkIsExistedRental(@Param("userId") Long userId,@Param("bookId") Long bookId);
}
