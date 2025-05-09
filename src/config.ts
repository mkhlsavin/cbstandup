interface Config {
  api: {
    baseUrl: string;
  };
}

export const config: Config = {
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  },
};
