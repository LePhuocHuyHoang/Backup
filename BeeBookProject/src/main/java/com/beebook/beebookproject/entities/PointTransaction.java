package com.beebook.beebookproject.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@Table(name = "point_transaction")
@AllArgsConstructor @NoArgsConstructor
public class PointTransaction {
    @Id
    @Column(name = "id_transaction")
    private String idTransaction;

    @Column(name = "transaction_date", nullable = false)
    private Date transactionDate;

    @Column(name = "points_added")
    private Long pointsAdded;

    @ManyToOne
//    @JsonIgnore
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
//    @JsonIgnore
    @JoinColumn(name = "transaction_type")
    private TransactionType transactionType;

}