package com.beebook.beebookproject.dto;

import com.beebook.beebookproject.entities.Book;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    private Book book;
    private double avg;
    private double rating;
    private boolean isBought;
}
