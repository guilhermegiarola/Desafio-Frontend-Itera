# Desafio Frontend Itera

Foi utilizado para a simulação do backend/servidor, o pacote "json-server", do NPM. Sua utilização consiste no comando "json-server.cmd --watch (arquivo.json)", em linha de comando, no diretório onde o arquivo .json está localizado. Desta forma, pode-se simular o backend de forma rápida e fácil, utilizando apenas um arquivo .json.

Este desafio foi implementado utilizando JavaScript com JQuery, o framework "DataTables", além de HTML.
O escopo do mesmo, consiste em:
  - renderizar a tabela utilizando o framework DataTable, apresentando os dados obtidos pelo arquivo .json,
  - adicionar uma coluna à tabela anterior, com botões que permitam ao usuário deletar a linha,
  - adicionar um botão que permita ao usuário adicionar uma linha (este foi feito em forma de formulário, logo acima da tabela, com suas respectivas validações de formato e validade de dados),
  - adicionar um botão que envia os dados atualizados da tabela, em formato .json, para um endpoint,
  - adicionar um botão que permite que o usuário limpe os dados da tabela.
