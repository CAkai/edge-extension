export async function * readStream<T>(reader: ReadableStreamDefaultReader<string>) {
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            reader.cancel();
            break;
        }

        // parse the data
        const data = /{.*}/.exec(value);
        if (!data || !data[0]) {
            continue;
        }
        yield JSON.parse(data[0]) as T;
    }
}