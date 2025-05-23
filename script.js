document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('graficoPizza').getContext('2d');
    const rootStyles = getComputedStyle(document.documentElement);

    const corBitcoin = rootStyles.getPropertyValue('--cor-bitcoin').trim();
    const corUSD = rootStyles.getPropertyValue('--cor-usd').trim();
    const corADA= rootStyles.getPropertyValue('--cor-ada').trim();
    const corBNB = rootStyles.getPropertyValue('--cor-bnb').trim();
    const corETH = rootStyles.getPropertyValue('--cor-eth').trim();
    const corBlack = rootStyles.getPropertyValue('--cor-black');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Bitcoin', 'USD', 'ADA', 'BNB', 'ETH'],
      datasets: [{
        data: [60, 25, 15, 30, 25],
        backgroundColor: [
          corBitcoin,
          corUSD,
          corADA,
          corBNB,
          corETH
        ],
        borderColor: [
          corBlack
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
});

document.getElementById("usuarioForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita recarregar a página

    let purchasedCryptoCode = document.getElementById("purchasedCryptoCode").value;
    let cryptoUsed = document.getElementById("cryptoUsed").value;
    let amountPurchased = document.getElementById("amountPurchased").value;
    let cryptoValue = document.getElementById("cryptoValue").value;
    let amountSpent = document.getElementById("amountSpent").value;
    let taxCryptoCode = document.getElementById("taxCryptoCode").value;
    let taxAmount = document.getElementById("taxAmount").value;
    let buyDate = document.getElementById("buyDate").value;
    let exchange = document.getElementById("exchange").value;
    

    fetch(`http://localhost:8080/buy`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            code:purchasedCryptoCode,
            codein:cryptoUsed,
            amountCryptoPurchased:amountPurchased,
            cryptoValue: cryptoValue,
            amountSpent: amountSpent,
            taxCryptoCode:taxCryptoCode,
            taxAmount:taxAmount,
            buyDate: buyDate,
            exchange: exchange     
    })

    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.json().catch(() => {
            // Fallback se não for JSON
            return { erro: "Resposta inválida do servidor" };
        });
    })
    .then(dados => {
        console.log("Sucesso:", dados);
        carregarProdutos();
    })
    .catch(erro => {
        console.error("Erro:", erro);
    });

});


async function carregarProdutos() {
    try {
        const resposta = await fetch(`http://localhost:8080/buy`);
        const buy = await resposta.json();
        console.log(buy)

        const tabelaCorpo = document.getElementById("tabela-corpo");
        tabelaCorpo.innerHTML = ""; // Limpa a tabela antes de adicionar novos dados

        buy.forEach(buyDTO => {
            // Criando um novo elemento
            const linha = document.createElement("tr");
            // Definindo o conteúdo da linha
            linha.innerHTML = `

                    <td>${buyDTO.id}</td>
                    <td>${buyDTO.code}</td>
                    <td>${buyDTO.amountCryptoPurchased}</td>
                    <td>${buyDTO.codein}</td>
                    <td>${buyDTO.cryptoValue}</td>
                    <td>${buyDTO.amountSpent}</td>
                    <td>${buyDTO.taxCryptoCode}</td>
                    <td>${buyDTO.taxAmount}</td>
                    <td>${buyDTO.buyDate}</td>
                    <td>${buyDTO.exchange}</td>
                    <td>${buyDTO.profit}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="removerLinha(${buyDTO.id}, this)">Excluir</button>
                    </td>
            `;
            tabelaCorpo.appendChild(linha); //adiciona o novo elemento na linha, sem recriar os existentes.
        });
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}

function removerLinha(id, botao){
    if(confirm("Tem certeza que deseja excluir este item?")){
        fetch(`http://localhost:8080/buy/${id}`,{
            method: "DELETE"
        })
        .then(response => {
            if(!response.ok) {
                throw new Error(`Erro ao excluir! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(() => {
            botao.closest("tr").remove();
        })
        .catch(erro => {
            console.error("Erro ao excluir:", erro);
        })
    }
}
