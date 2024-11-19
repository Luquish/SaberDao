// Crear un archivo de utilidad para manejar parámetros de URL
export const getUrlParams = {
  governor: (pathname: string) => {
    const paths = pathname.split('/');
    return paths[paths.indexOf('gov') + 1] || '';
  },
  
  proposal: (pathname: string) => {
    const paths = pathname.split('/');
    return paths[paths.indexOf('proposals') + 1] || '';
  },
  
  gauge: (pathname: string) => {
    const paths = pathname.split('/');
    return paths[paths.indexOf('gauges') + 1] || '';
  },
  
  save: (pathname: string) => {
    const paths = pathname.split('/');
    return paths[paths.indexOf('saves') + 1] || '';
  },
  
  voter: (pathname: string) => {
    const paths = pathname.split('/');
    return paths[paths.indexOf('address') + 1] || '';
  },

  poolID: (pathname: string) => {
    const paths = pathname.split('/');
    return paths[paths.indexOf('saber-pools') + 1] || '';
  },

  tokenMint: (pathname: string) => {
    const paths = pathname.split('/');
    return paths[paths.indexOf('treasury') + 2] || '';
  },

  minterAuthority: (pathname: string) => {
    const paths = pathname.split('/');
    return paths[paths.indexOf('minters') + 1] || '';
  },

  lockerSubpage: (pathname: string) => {
    const paths = pathname.split('/');
    return paths[paths.indexOf('locker') + 1] || '';
  },

  programID: (pathname: string) => {
    const paths = pathname.split('/');
    return paths[paths.indexOf('programs') + 2] || '';
  },

  redeemer: (pathname: string) => {
    const paths = pathname.split('/');
    return paths[paths.indexOf('redeemer') + 1] || '';
  },

  executive: (pathname: string) => {
    const paths = pathname.split('/');
    return paths[paths.indexOf('dao') + 1] || '';
  },

  manageSection: (pathname: string) => {
    const paths = pathname.split('/');
    return paths[paths.indexOf('manage') + 1] || '';
  },

  nftGaugeLabel: (pathname: string) => {
    const paths = pathname.split('/');
    return paths[paths.indexOf('nftgauges') + 1] || '';
  }
}; 