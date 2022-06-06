import React from 'react'
import { Stack, styled } from '@mui/material'

import { colors } from 'shared/theme/colors'

const Spinner: React.FC = () => (
  <Container>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ margin: 'auto', background: 'transparent', display: 'block' }}
      width="34px"
      height="34px"
      preserveAspectRatio="xMidYMid">
      <circle
        cx="50"
        cy="50"
        r="32"
        strokeWidth="8"
        stroke={colors.primary}
        strokeDasharray="50.26548245743669 50.26548245743669"
        fill="none"
        strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="2s"
          keyTimes="0;1"
          values="0 50 50;360 50 50"></animateTransform>
      </circle>
    </svg>
  </Container>
)

export default Spinner

const Container = styled(Stack)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`
