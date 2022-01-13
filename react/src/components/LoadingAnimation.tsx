import * as React from "react"

const LoadingAnimation = () => (
  <svg height={20} width={112}>
    <line 
      x1="-12" 
      x2="-12"
      y1="10" 
      y2="10" 
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="0.25, 15.75"
    >
      <animate
        attributeName="x2"
        values="-12;84"
        dur="3s"
        repeatCount="indefinite"
      />
    </line>
  </svg>
)

export default LoadingAnimation