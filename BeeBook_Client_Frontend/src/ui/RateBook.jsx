import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const RateBook = ({ isReadOnly, rating, handleRateBook }) => {
  const [value, setValue] = useState(2);

  if (isReadOnly)
    return <Rating name="read-only" value={rating} readOnly precision={0.5} />;
  return (
    <Box
      sx={{
        "& > legend": { mt: 5 },
      }}
      width={"10rem"}
    >
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          if (newValue === null) return;
          handleRateBook(newValue);
        }}
        size="large"
        className="rate-stars"
      />
    </Box>
  );
};

export default RateBook;
