
export interface RPC {

  connect(cb: () => void);

  emit(address: string, data, headers, cb: (e:Error, d?) => void, timeout: number);

  on(address: string, func);

  publish(address: string, data, headers);

};

