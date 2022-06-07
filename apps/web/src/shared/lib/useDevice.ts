import { useMediaQuery, useTheme } from '@mui/material'

const useIsDevice = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.up('xs'))
  const isTablet = useMediaQuery(theme.breakpoints.up('sm'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  return {
    isMobile: isMobile && !isTablet,
    isTablet: isTablet && !isDesktop,
    isDesktop,
  }
}

export default useIsDevice
