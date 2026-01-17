export default function Logo() {
  return (
    <svg
      width="150" 
      height="40" 
      viewBox="0 0 150 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer" 
    >
      <text
        x="0"
        y="30"
        fontFamily="Arial, sans-serif"
        fontSize="32"
        fontWeight="bold"
        fontStyle="italic"
        fill="#f34700" 
      >
        Next
      </text>
      <text
        x="72" // 'Next' 길이에 따라 조절 필요
        y="30"
        fontFamily="Arial, sans-serif"
        fontSize="32"
        fontWeight="bold"
        fill="#000000" 
      >
        Cart
      </text>
    </svg>
  );
}