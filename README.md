# TraceKit

Biblioteca de logging para Node.js, escrita em TypeScript e distribuída em CommonJS com declarações de tipos. Suporta os níveis `DEBUG`, `INFO`, `WARN` e `ERROR`, formatação em texto ou JSON e saída para console, memória ou streams. Permite combinar destinos e adicionar formatadores, appenders e filtros personalizados pelos contratos públicos. Não possui dependências de runtime.

## Instalação

Na pasta da biblioteca:

```sh
npm install
npm run build
npm pack
```

A compilação gera `dist/`, e o empacotamento gera `tracekit-0.1.0.tgz`. Em outro projeto Node.js, instale o arquivo pelo seu caminho:

```sh
npm install "CAMINHO/tracekit-0.1.0.tgz"
```

O pacote não está publicado no npm. Consumidores TypeScript precisam de `@types/node` nas dependências de desenvolvimento.

## Uso básico

```js
const { Logger } = require('tracekit');

const logger = new Logger();
logger.debug('Iniciando');
logger.info('Pedido recebido', { requestId: 'abc' });
logger.warn('Estoque baixo');
logger.error('Pagamento recusado');
```

Sem configuração, o Logger escreve texto no console. Cada mensagem inclui nível e timestamp; o segundo argumento opcional contém informações adicionais.

## Configuração

```js
const {
  LoggerBuilder,
  MemoryAppender,
  StreamAppender,
  JsonFormatter,
  LevelFilterHandler,
} = require('tracekit');

const formatter = new JsonFormatter();
const memory = new MemoryAppender(formatter);
const logger = new LoggerBuilder()
  .addAppender(new StreamAppender(process.stdout, formatter))
  .addAppender(memory)
  .addHandler(new LevelFilterHandler('INFO'))
  .build();

logger.debug('Ignorado pelo filtro');
logger.info('Pagamento processado', { orderId: 123 });
console.log(memory.getMessages());
```

O Builder encaminha os logs aprovados para todos os destinos configurados. Os filtros executam na ordem em que são adicionados. `PredicateFilterHandler` também permite filtrar por uma função que recebe a entrada e retorna `true` ou `false`.

Para estender a biblioteca, implemente `LogFormatter.format(entry)`, `Appender.append(entry)` ou `LogHandler.handle(entry, next)`. Um handler chama `next()` uma vez para continuar ou não o chama para interromper. Destinos textuais podem estender `BaseAppender` e implementar apenas `write(message)`.

O `StreamAppender` acrescenta uma quebra de linha por entrada. O consumidor gerencia os erros e o encerramento do stream; a biblioteca não aguarda a conclusão da escrita ou `drain`.
