package com.beebook.beebookproject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RentalReceiptDTO {
	private Long book_id;
	private String book_name;
	private String rentalDate;
	private Long pointPrice;
}
