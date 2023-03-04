function formatCNPJ(value) {
	value = value.replace(/^(\d{2})(\d)/, "$1.$2");
	value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
	value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
	value = value.replace(/(\d{4})(\d)/, "$1-$2");
	return value;
}

function formatDate(value) {
	let v = value.replace(/\D/g, '').slice(0, 10);
	if (v.length >= 5) {
		return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
	}
	else if (v.length >= 3) {
		return `${v.slice(0, 2)}/${v.slice(2)}`;
	}
	return v
}

function addIdentifier(target) {
	target.id = iterator;
	iterator++;
}

//To start the JSON server, the command is json-server.cmd --watch data.json
$(document).ready(function () {
	$('#myTable thead tr').append('<th/>');
	$('#myTable').DataTable({
		"processing": true,
		"ajax": {
			"url": "http://localhost:3000/companies",
			dataSrc: ''
		},
		"columns": [{
			"data": "name"
		}, {
			"data": "cnpj",
			render: function (data, type, item) {
				let value = item.cnpj;
				if (!value) return 0;
				//Colocando a máscara no valor do CNPJ a ser exibido pela coluna.
				value = formatCNPJ(value);
				return value;
			}
		}, {
			"data": "numFunc"
		}, {
			"data": "dataAbertura",
			render: function (data, type, item) {
				const value = item.dataAbertura;
				if (!value) return 0;
				//Colocando a máscara na data a ser exibida pela coluna.
				return formatDate(value);
			}
		}, {
			"data": "valorAcao",
			render: function (data, type, item) {
				const value = parseFloat(item.valorAcao);
				if (!value) return 0;
				//Colocando a máscara no valor da ação a ser exibido pela coluna.
				return "R$ " + value.toLocaleString('pt-br', {minimumFractionDigits: 2})
			}
		}, {
			"data": null,
			render: function (data, type, row) {
				//Retorno do botão que remove uma linha da tabela.
				return '<button class="removeButton">Remover</button>'
			}
		}]
	});
});

//Funções de utilidade para os botões da página.
$(function () {
	//Limitando o campo de inserção do CNPJ a aceitar somente números.
	$("input[name='inputCNPJ']").on('input', function (e) {
		$(this).val($(this).val().replace(/[^0-9]/g, ''));
	});
	//Limitando o campo de inserção do número de funcionários a aceitar somente números.
	$("input[name='numFuncionarios']").on('input', function (e) {
		$(this).val($(this).val().replace(/[^0-9]/g, ''));
	});

	//Limpando a tabela ao clicar no botão "Limpar Tabela"
	$("button[id='clearTable']").on('click', function () {
		var table = $('#myTable').DataTable();
		table.clear().draw();
	});

	//Adicionando e populando uma nova linha ao enviar o formulário.
	$("button[id=submit]").on('click', function () {
		var nome = $(".inputName").val();
		var cnpj = $(".inputCNPJ").val();
		var numFuncionarios = $(".numFuncionarios").val();
		var dataAbertura = $(".inputDate").val();
		var valorAcao = $(".actionValue").val();
		var table = $('#myTable').DataTable();
		var data = {
			"name": nome,
			"cnpj": cnpj,
			"numFunc": numFuncionarios,
			"dataAbertura": dataAbertura,
			"valorAcao": valorAcao,
			null: '<button class="removeButton">Remover</button>',
		}
		table.row.add(data).draw(false);
	});

	//Removendo linha da tabela ao clicar no botão.
	$('#myTable').on('click', '.removeButton', function () {
		var table = $('#myTable').DataTable();
		table.row($(this).parents('tr')).remove().draw();
		// $.ajax({
		// 	type: 'DELETE',
		// 	url: `http://localhost:3000/companies/${a}`,
	});

	//Enviando os dados para o arquivo .JSON no servidor.
	$("button[id=sendData]").on('click', function () {
		var jsonData = $('#myTable').DataTable().rows().data().toArray();
		for (var iter = 0; iter < jsonData.length; iter++) {
			//Requisito para o funcionamento do JSON Server.
			jsonData[iter] = {"id": `${iter + 1}`, ...jsonData[iter]}
			//Removendo colunas inseridas em tempo de execução.
			delete jsonData[iter]["null"];
			$.ajax({
				type: 'PUT',
				url: `http://localhost:3000/companies/${iter + 1}`,
				data: jsonData[iter],
				dataType: "json",
			});
		}
	});
})
