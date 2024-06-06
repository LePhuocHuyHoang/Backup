import styled, { css } from "styled-components";
const variation = {
  primary: css`
    padding: 15px 30px;
    text-align: center;
    text-transform: uppercase;
    transition: 0.5s;
    background-size: 200% auto;
    color: white;
    border-radius: 10px;
    display: block;
    border: 0px;
    font-weight: 700;
    box-shadow: 0px 0px 14px -7px #f09819;
    background-image: linear-gradient(
      45deg,
      #ff512f 0%,
      #f09819 51%,
      #ff512f 100%
    );
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;

    &:hover {
      background-position: right center;
      color: #fff;
      text-decoration: none;
    }

    &:active {
      transform: scale(0.95);
    }
  `,
  secondary: css`
    padding: 15px 30px;
    text-align: center;
    text-transform: uppercase;
    transition: 0.5s;
    background-size: 200% auto;
    color: black; /* Change text color to match the gradient */
    border-radius: 10px;
    display: inline-block; /* Change to inline-block to keep it in the flow */
    border: 2px solid black; /* Add border with primary color */
    font-weight: 700;
    box-shadow: none; /* Remove box-shadow */
    background-image: none; /* Remove background image */

    &:hover {
      background-position: right center;
      color: white;
      text-decoration: none;
      background-image: linear-gradient(
        45deg,
        #ff512f 0%,
        #f09819 51%,
        #ff512f 100%
      );
    }

    &:active {
      transform: scale(0.95);
    }
  `,
};
const StyledButton = styled.button`
  ${(props) => variation[props.variation]}
`;
function Button({ type, className, variation, children, onClick }) {
  return (
    <StyledButton
      type={type}
      className={className}
      variation={variation}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
}
Button.defaultProps = {
  type: "button",
  variation: "primary",
};
export default Button;
