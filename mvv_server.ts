import { MVVServer } from './server.ts';

const mvvServer = new MVVServer('0.0.0.0', 8080);
mvvServer.serve();