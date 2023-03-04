function formatCNPJ(value) {
	value = value.replace(/^(\d{2})(\d)/, "$1.$2");
	value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
	value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
	value = value.replace(/(\d{4})(\d)/, "$1-$2");
	return value;
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
			"data": "dataAbertura"
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
				return '<button class="removeButton">Remover</button>'
			}
		}]
	});
});

$(function () {
	//Limitando o campo de inserção do CNPJ a aceitar somente números.
	$("input[name='inputCNPJ']").on('input', function (e) {
		$(this).val($(this).val().replace(/[^0-9]/g, ''));
	});
	//Limitando o campo de inserção do número de funcionários a aceitar somente números.
	$("input[name='numFuncionarios']").on('input', function (e) {
		$(this).val($(this).val().replace(/[^0-9]/g, ''));
	});

	$("button[id='clearTable']").on('click', function () {
		var table = $('#myTable').DataTable();
		table.clear().draw();
	});
})

//Removendo linha da tabela ao clicar no botão.
$('#myTable').on('click', '.removeButton', function () {
	var table = $('#myTable').DataTable();
	table.row($(this).parents('tr')).remove().draw();
});



