class GUI {
    escreverResultado(resultado, linha) {
        let tabela = document.querySelector("table");
        let row = tabela.rows[linha];
        let coluna = row.getElementsByTagName("td")[0];
        let formatter = new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' });
        coluna.innerHTML = formatter.format(resultado);
    }
    tabelaProgressiva(table, salario) {
        let imposto = 0;
        for (let i = 1; i < table.length; i++) {
            let { m: mp } = table[i - 1];
            let { m: mc, i: ic } = table[i];
            if (salario > mp && salario <= mc) {
                imposto += (salario - mp) * ic;
            } else {
                if (salario > mc) {
                    imposto += (mc - mp) * ic;
                }
            }
        }
        return imposto;
    }
    calcularINSS(salario) {
        let table = [{ m: 0, i: 0 }, { m: 1302, i: 0.075 }, { m: 2571.29, i: 0.09 }, { m: 3856.94, i: 0.12 }, { m: 7507.49, i: 0.14 }];
        return this.tabelaProgressiva(table, salario);
    }
    calcularIR(base) {
        let table = [{ m: 1903.98, i: 0 }, { m: 2826.65, i: 0.075 }, { m: 3751.05, i: 0.15 }, { m: 4664.68, i: 0.225 }, { m: Number.POSITIVE_INFINITY, i: 0.275 }];
        return this.tabelaProgressiva(table, base);
    }
    calcularValeTransporte(passagem, salario) {
        let x = 22 * (passagem * 2 - (salario / 30) * 0.06);
        return (x > 0) ? x : 0;
    }
    calcular() {
        let form = document.forms[0];
        let salario = form.salario.valueAsNumber, inss, ir, fgts;
        if (salario > 0) {
            inss = this.calcularINSS(salario);
            this.escreverResultado(inss, 0);
            ir = this.calcularIR(salario - inss);
            this.escreverResultado(ir, 1);
            fgts = salario * 0.08;
            this.escreverResultado(fgts, 4);
        }
        let passagem = form.passagem.valueAsNumber;
        let transporte = 0;
        if (passagem > 0) {
            transporte = this.calcularValeTransporte(passagem, salario);
            this.escreverResultado(transporte, 2);
        }
        if (salario > 0) {
            this.escreverResultado(salario - inss - ir + transporte, 3);
        }
    }
    registerEvents() {
        let form = document.forms[0];
        form.salario.onkeyup = this.calcular.bind(this);
        form.passagem.onkeyup = this.calcular.bind(this);
        form.salario.focus();
    }
}
let gui = new GUI();
gui.registerEvents();