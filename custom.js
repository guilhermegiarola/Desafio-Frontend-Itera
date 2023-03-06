//Função necessária para a formatação do CNPJ ao inserir no DataTable.
function formatCNPJ(value) {
	value = value.replace(/^(\d{2})(\d)/, "$1.$2");
	value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
	value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
	value = value.replace(/(\d{4})(\d)/, "$1-$2");
	return value;
}

//Função necessária para a formatação da data ao inserir no DataTable.
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

function clearForm() {
	$(".inputName").val("");
	$(".inputCNPJ").val("");
	$(".numFuncionarios").val("");
	$(".inputDate").val("");
	$(".actionValue").val("");
}

//Esta função esconde todos os elementos de validação assim que a página carrega.
function setupFormValidationOnLoad() {
	$("#inputNameValidation").hide();
	$("#inputCnpjValidation").hide();
	$("#invalidCnpj").hide();
	$("#inputNumFuncionarios").hide();
	$("#inputActionValue").hide();
	$("#inputDateValidation").hide();
	$("#inputActionFormat").hide();
	$("#dateFormatValidation").hide();
	$("#dateMomentValidation").hide();
}

function validateCnpj(isFormValid) {
	var cnpj = $(".inputCNPJ").val();
	if ((cnpj.substring(11, 15) !== "0001" || cnpj.length != 18) && cnpj.length > 0) {
		isFormValid = false;
		$("#invalidCnpj").show();
	} else {
		$("#invalidCnpj").hide();
	}
	return isFormValid;
}

Date.prototype.isValid = function () {
	return this.getTime() === this.getTime();
};

function validateDate(isFormValid) {
	var data = $(".inputDate").val();
	if (data.length < 10 && data.length != 0) {
		isFormValid = false;
		$("#dateFormatValidation").show();
	} else {
		$("#dateFormatValidation").hide();
	}

	var dateFormattingArray = data.split("/");
	var now = new Date();
	var dateInTheFuture = false;
	console.log(dateFormattingArray[1], now.getMonth(), dateFormattingArray[2], now.getFullYear());

	if (dateFormattingArray[2] > now.getFullYear()) {
		dateInTheFuture = true;
	} else if ((dateFormattingArray[1] > now.getMonth() && dateFormattingArray[2] == now.getFullYear()) || dateFormattingArray[1] > 12) {
		dateInTheFuture = true;
	} else if (!dateInTheFuture && dateFormattingArray[0] > now.getDate() && dateFormattingArray[0] > 31) {
		dateInTheFuture = true;
	}

	if (isFormValid && data.length != 0 && dateInTheFuture) {
		isFormValid = false;
		$("#dateMomentValidation").show();
	} else {
		$("#dateMomentValidation").hide();
	}
	return isFormValid;
}

function validateValue(isFormValid) {
	var valorAcao = $(".actionValue").val();
	if (valorAcao.length != 0 && !valorAcao.match('^\[0-9]+(\.[0-9][0-9])?$')) {
		isFormValid = false;
		$("#inputActionFormat").show();
	} else {
		$("#inputActionFormat").hide();
	}
	return isFormValid;
}

function validateLength(isFormValid) {
	var name = $(".inputName").val();
	var cnpj = $(".inputCNPJ").val();
	var numFuncionarios = $(".numFuncionarios").val();
	var dataAbertura = $(".inputDate").val();
	var valorAcao = $(".actionValue").val();
	if (name.length == 0) {
		$("#inputNameValidation").show();
		isFormValid = false;
	} else {
		$("#inputNameValidation").hide();
	}
	if (cnpj.length == 0) {
		$("#inputCnpjValidation").show();
		isFormValid = false;
	} else {
		$("#inputCnpjValidation").hide();
	}

	if (dataAbertura.length == 0) {
		$("#inputDateValidation").show();
		isFormValid = false;
	} else {
		$("#inputDateValidation").hide();
	}

	if (numFuncionarios.length == 0) {
		$("#inputNumFuncionarios").show();
		isFormValid = false;
	} else {
		$("#inputNumFuncionarios").hide();
	}

	if (valorAcao.length == 0) {
		$("#inputActionValue").show();
		isFormValid = false;
	} else {
		$("#inputActionValue").hide();
	}
	return isFormValid;
}

$(document).ready(function () {
	setupFormValidationOnLoad();
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

//Funções de utilidade para os campos e botões da página.
$(function () {
	//Limitando o campo de inserção do CNPJ a aceitar somente números.
	$("input[id='inputCNPJ']").on('input', function () {
		$(this).val($(this).val().replace(/[^0-9]/g, ''));
		$(this).val(formatCNPJ($(this).val()));
	});

	//Limitando o campo de inserção do CNPJ a aceitar somente números.
	$("input[id='inputDate']").on('input', function () {
		$(this).val($(this).val().replace(/[^0-9]/g, ''));
		$(this).val(formatDate($(this).val()));
	});

	//Limitando o campo de inserção do número de funcionários a aceitar somente números.
	$("input[id='numFuncionarios']").on('input', function () {
		$(this).val($(this).val().replace(/[^0-9]/g, ''));
	});

	//Limitando o campo de inserção do valor da ação a aceitar números e decimais.
	$("input[id='actionValue']").on('input', function () {
		$(this).val($(this).val().replace(/[^0-9.]/g, ''));
	});
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
	var isLengthValid = true;
	var isValueValid = true;
	var isDateValid = true;
	var isCnpjValid = true;

	//Aplicação da validação na tentativa de enviar o formulário.
	isLengthValid = validateLength(isLengthValid);
	isValueValid = validateValue(isValueValid);
	isDateValid = validateDate(isDateValid);
	isCnpjValid = validateCnpj(isCnpjValid);

	if (isCnpjValid && isLengthValid && isDateValid && isValueValid) {
		clearForm();
		table.row.add(data).draw(false);
	}
});

//Removendo linha da tabela ao clicar no botão.
$('#myTable').on('click', '.removeButton', function () {
	var table = $('#myTable').DataTable();
	table.row($(this).parents('tr')).remove().draw();
});

//Enviando os dados para o arquivo .JSON no servidor.
$("button[id=sendData]").on('click', function () {

	var deleteCurrentJSON = $.getJSON("http://localhost:3000/companies", function (data) {
		var items = [];
		$.each(data, function (key, val) {
			items.push(val);
			$.ajax({
				type: 'DELETE',
				async: false,
				url: `http://localhost:3000/companies/${val["id"]}`,
				data: val,
				dataType: "json",
			});
		});
	});

	var tablesData = $('#myTable').DataTable().rows().data().toArray();
	if (tablesData.length > 0) {
		deleteCurrentJSON.done(function () {
			for (var iter = 0; iter < tablesData.length; iter++) {
				//Removendo colunas inseridas em tempo de execução.
				delete tablesData[iter]["null"];
				$.ajax({
					type: 'POST',
					async: false,
					url: `http://localhost:3000/companies/`,
					data: tablesData[iter],
					dataType: "json",
				});
			}
		});
	}
});
