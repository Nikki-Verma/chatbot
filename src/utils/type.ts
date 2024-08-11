export interface ReadableStreamDefaultReader<T = any> {
    read(): Promise<ReadableStreamReadResult<T>>;
    releaseLock(): void;
    cancel(reason?: any): Promise<void>;
}
  
export interface ReadableStreamReadResult<T> {
    done: boolean;
    value?: T;
}
  
export interface ReadableStream<T = any> {
    getReader(): ReadableStreamDefaultReader<T>;
}