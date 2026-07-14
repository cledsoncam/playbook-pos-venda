(function () {
  'use strict';

  function fmt(n) {
    if (!isFinite(n)) n = 0;
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  }
  function num(id) {
    var el = document.getElementById(id);
    return el ? (Number(el.value) || 0) : 0;
  }
  function set(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function calcSimple() {
    var meta = num('calcMeta');
    var usinas = num('calcUsinas');
    var conversao = num('calcConversao');
    var custosFixos = num('calcCustosFixos');
    var custosVariaveis = num('calcCustosVariaveis');

    var clientes = Math.round(usinas * (conversao / 100));
    var ticketNecessario = clientes > 0 ? (meta / clientes) : 0;
    var custoVar = meta * (custosVariaveis / 100);
    var lucro = meta - custoVar - custosFixos;

    set('out-ticketNecessario', fmt(ticketNecessario));
    set('out-lucro', fmt(lucro));
    set('out-clientesConvertidos', clientes);
  }

  function calcPro() {
    var p = {
      veiculoPreco: num('pro-veiculoPreco'), veiculoDiasUteis: num('pro-veiculoDiasUteis'), veiculoDiasUso: num('pro-veiculoDiasUso'),
      combKmLitro: num('pro-combKmLitro'), combPrecoLitro: num('pro-combPrecoLitro'), combKmRodado: num('pro-combKmRodado'),
      hospQt: num('pro-hospQt'), hospValorDia: num('pro-hospValorDia'), hospDias: num('pro-hospDias'),
      alimQt: num('pro-alimQt'), alimValorDia: num('pro-alimValorDia'), alimDias: num('pro-alimDias'),
      terEngPreco: num('pro-terEngPreco'), terEngDias: num('pro-terEngDias'),
      terTecPreco: num('pro-terTecPreco'), terTecDias: num('pro-terTecDias'),
      propEngSalario: num('pro-propEngSalario'), propEngEncargos: num('pro-propEngEncargos'), propEngDias: num('pro-propEngDias'),
      propTecSalario: num('pro-propTecSalario'), propTecEncargos: num('pro-propTecEncargos'), propTecDias: num('pro-propTecDias'),
      materiais: num('pro-materiais'), impostosPct: num('pro-impostosPct'), precoFinal: num('pro-precoFinal'),
    };

    var veiculoTotal = (p.veiculoPreco / (p.veiculoDiasUteis || 1)) * p.veiculoDiasUso;
    var combTotal = (p.combKmRodado / (p.combKmLitro || 1)) * p.combPrecoLitro;
    var hospTotal = p.hospQt * p.hospValorDia * p.hospDias;
    var alimTotal = p.alimQt * p.alimValorDia * p.alimDias;
    var custosOperacionais = veiculoTotal + combTotal + hospTotal + alimTotal;

    var terTotal = p.terEngPreco * p.terEngDias + p.terTecPreco * p.terTecDias;
    var propEngValorDia = p.propEngSalario * (1 + p.propEngEncargos / 100) / 22;
    var propTecValorDia = p.propTecSalario * (1 + p.propTecEncargos / 100) / 22;
    var propTotal = propEngValorDia * p.propEngDias + propTecValorDia * p.propTecDias;
    var equipeTotal = terTotal + propTotal;

    var impostosValor = p.precoFinal * (p.impostosPct / 100);
    var lucroValor = p.precoFinal - custosOperacionais - equipeTotal - p.materiais - impostosValor;
    var custoTotalSemLucro = custosOperacionais + equipeTotal + p.materiais + impostosValor;
    var markupPct = custoTotalSemLucro > 0 ? (p.precoFinal / custoTotalSemLucro * 100) : 0;
    var lucroPct = p.precoFinal > 0 ? (lucroValor / p.precoFinal * 100) : 0;

    set('out-proVeiculoTotal', fmt(veiculoTotal));
    set('out-proCombTotal', fmt(combTotal));
    set('out-proHospTotal', fmt(hospTotal));
    set('out-proAlimTotal', fmt(alimTotal));
    set('out-proCustosOperacionais', fmt(custosOperacionais));
    set('out-proTerTotal', fmt(terTotal));
    set('out-proPropTotal', fmt(propTotal));
    set('out-proEquipeTotal', fmt(equipeTotal));
    set('out-proCustosOperacionais2', fmt(custosOperacionais));
    set('out-proImpostos', fmt(impostosValor));
    set('out-proLucro', fmt(lucroValor));
    set('out-proLucroPct', lucroPct.toFixed(1) + '%');
    set('out-proMarkup', markupPct.toFixed(0) + '%');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var simpleIds = ['calcMeta', 'calcUsinas', 'calcConversao', 'calcCustosFixos', 'calcCustosVariaveis'];
    simpleIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', calcSimple);
    });
    calcSimple();

    var proIds = ['veiculoPreco','veiculoDiasUteis','veiculoDiasUso','combKmLitro','combPrecoLitro','combKmRodado',
      'hospQt','hospValorDia','hospDias','alimQt','alimValorDia','alimDias','terEngPreco','terEngDias','terTecPreco',
      'terTecDias','propEngSalario','propEngEncargos','propEngDias','propTecSalario','propTecEncargos','propTecDias',
      'materiais','impostosPct','precoFinal'];
    proIds.forEach(function (id) {
      var el = document.getElementById('pro-' + id);
      if (el) el.addEventListener('input', calcPro);
    });
    calcPro();
  });
})();
