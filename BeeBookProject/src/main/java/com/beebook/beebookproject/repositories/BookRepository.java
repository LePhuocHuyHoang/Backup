package com.beebook.beebookproject.repositories;

import com.beebook.beebookproject.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Repository
public interface BookRepository extends JpaRepository<Book,Long>{
    @Modifying
    @Transactional
    @Query(value = "EXEC deleteBook @bookId = :bookId", nativeQuery = true)
    void deleteBook(@Param("bookId")Long bookId);
    @Query("SELECT COUNT(b) > 0 FROM Book b WHERE b.id = :bookId")
    boolean existsById(@Param("bookId") Long bookId);
    @Query(value = "SELECT b FROM Book b " +
                    "WHERE LOWER(b.name) LIKE %:keyword%")
    List<Book> searchBook(String keyword);
    @Query(value = "EXEC getTop3BestSellingBooks", nativeQuery = true)
    List<Book> getTop3BookSelling();
    @Query(value = "EXEC filterBook @typeName= :typeName, @authorName= :authorName, @minPointPrice= :minPointPrice, @maxPointPrice= :maxPointPrice ", nativeQuery = true)
    List<Book> filterBook(@Param("typeName") String typeName, @Param("authorName") String authorName, @Param("minPointPrice") BigDecimal minPointPrice, @Param("maxPointPrice") BigDecimal maxPointPrice);

    boolean existsByName(String name);

    @Modifying
    @Query(value = "select * from dbo.[user] where username = :userName", nativeQuery = true)
    List<Object[]> checkExistingUser(@Param("userName") String userName);

    @Modifying
    @Query(value = "select COUNT(*) from rating where user_id =:userId and book_id =:bookId", nativeQuery = true)
    List<Integer> checkExistsRating(@Param("userId") Long userId, @Param("bookId") Long bookId);

    @Modifying
    @Transactional
    @Query(value= "exec insertRating :userId, :bookId, :rating", nativeQuery = true)
    void insertRating(@Param("userId") Long userId, @Param("bookId") Long bookId, @Param("rating") Long rating);

    @Modifying
    @Transactional
    @Query(value= "exec updateRating :userId, :bookId, :rating", nativeQuery = true)
    void updateRating(@Param("userId") Long userId, @Param("bookId") Long bookId, @Param("rating") Long rating);

    @Modifying
    @Transactional
    @Query(value= "exec insertComment :userName, :bookId, :comment", nativeQuery = true)
    void insertComment(@Param("userName") String userName, @Param("bookId") Long bookId, @Param("comment") String comment);

    @Modifying
    @Transactional
    @Query(value= "exec getComment :bookId, :offset, :fetch", nativeQuery = true)
    List<Object[]> getComment(@Param("bookId") Long bookId, @Param("offset") Long offset, @Param("fetch") Long fetch);

    @Modifying
    @Transactional
    @Query(value= "exec reportBook :userId, :bookId, :reportContent", nativeQuery = true)
    void reportBook(@Param("userId") Long userId, @Param("bookId") Long bookId, @Param("reportContent") String reportContent);

    @Query(value="EXEC GetFeaturedBooks :top", nativeQuery = true)
    List<Map<String, Object>> getFeaturedBooks(@Param("top") int top);
    @Query(value="EXEC GETNEWBOOKS", nativeQuery = true)
    List<Map<String, Object>> getNewBooks();

    @Transactional
    @Query(value= "exec averageRating :bookId", nativeQuery = true)
    Object[] averageRating(@Param("bookId") Long bookId);

    @Query(value = "EXEC GetTopRentedBooks :rank", nativeQuery = true)
    List<Book> getTopRentalBooks(@Param("rank")int rank);

    @Modifying
    @Transactional
    @Query(value = "select * from rental_receipt where user_id = :userId and book_id = :bookId", nativeQuery = true)
    Object[] checkIsBought(@Param("userId")long userId, @Param("bookId")long bookId);

}
