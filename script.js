document.addEventListener('DOMContentLoaded', () => {
    let cumulativeProfit = 0;
    let cumulativeLoss = 0;
    let totalProfits = 0; // Variable to count the Profits

    const rows = document.querySelectorAll("#tradeBody tr");
    let tradeNumber = 1;
    let totalDayProfit = 0;
    let totalDayLoss = 0;
    let previousDay = '';
    let cumulativeTotal = 0;

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let [date, stock, moneyStart, pl] = [
            cells[0].textContent,
            cells[1].textContent,
            parseFloat(cells[2].textContent),
            parseFloat(cells[3].textContent)
        ];

        if (previousDay !== date) {
            totalDayProfit = 0;
            totalDayLoss = 0;
            previousDay = date;
        }

        const moneyEnd = moneyStart + pl;
        if (pl > 0) {
            totalDayProfit += pl;
            cumulativeProfit += pl;
            totalProfits++; // Increment Profits if profit is positive
        } else {
            totalDayLoss += pl;
            cumulativeLoss += pl;
        }

        cumulativeTotal = cumulativeProfit + cumulativeLoss;

        const formattedTotalProfit = cumulativeProfit > 0 ? `+${cumulativeProfit.toFixed(2)}` : cumulativeProfit.toFixed(2);
        const formattedTotalLoss = cumulativeLoss < 0 ? `-${Math.abs(cumulativeLoss).toFixed(2)}` : `+${cumulativeLoss.toFixed(2)}`;
        const formattedTotal = cumulativeTotal > 0 ? `+${cumulativeTotal.toFixed(2)}` : cumulativeTotal.toFixed(2);

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${tradeNumber++}</td>
            <td>${date}</td>
            <td>${stock}</td>
            <td>${moneyStart.toFixed(2)}</td>
            <td>${moneyEnd.toFixed(2)}</td>
            <td>${pl > 0 ? `+${pl.toFixed(2)}` : pl.toFixed(2)}</td>
            <td>${totalDayProfit !== 0 ? `+${totalDayProfit.toFixed(2)}` : '0'}</td>
            <td>${totalDayLoss !== 0 ? `${totalDayLoss.toFixed(2)}` : '0'}</td>
            <td>${formattedTotalProfit}</td>
            <td>${formattedTotalLoss}</td>
            <td>${formattedTotal}</td>
        `;

        row.replaceWith(newRow);

        const newCells = newRow.querySelectorAll('td');
        const lastCell = newCells[10];

        if (lastCell.textContent.startsWith('+')) {
            lastCell.classList.add('positive-glow');
            lastCell.classList.remove('negative-pulse');
        } else {
            lastCell.classList.remove('positive-glow');
            lastCell.classList.add('negative-pulse');
        }

        newCells.forEach(cell => {
            if (cell.textContent.startsWith('+')) {
                cell.classList.add('positive');
                cell.classList.remove('negative');
            } else if (cell.textContent.startsWith('-')) {
                cell.classList.add('negative');
                cell.classList.remove('positive');
            }
        });

        if (pl > 0) {
            newCells[5].classList.add('positive');
            newCells[5].classList.remove('negative');
        } else if (pl < 0) {
            newCells[5].classList.add('negative');
            newCells[5].classList.remove('positive');
        }
    });

    const totalCells = document.querySelectorAll("#tradeBody tr td:nth-child(11)");
    let highestValue = -Infinity;
    let highestCell = null;

    totalCells.forEach(cell => {
        const cellValue = parseFloat(cell.textContent);
        if (cellValue > highestValue) {
            highestValue = cellValue;
            highestCell = cell;
        }
    });

    if (highestCell) {
        highestCell.classList.remove('positive-glow');
        highestCell.classList.add('glowing-gold');
    }

    // Calculate Profit Probability as a percentage
    const profitProbability = (totalProfits / rows.length * 100).toFixed(2);

    // Update the stats section for Profit Probability
    const profitRateElement = document.getElementById('profitRate');
    if (profitRateElement) {
        profitRateElement.textContent = `Profit Rate: ${profitProbability}%`;
    }

    // Clipboard functionality
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => {
        cell.style.position = 'relative';

        cell.addEventListener('click', () => {
            if (cell.textContent.trim() === '') return;

            navigator.clipboard.writeText(cell.textContent);

            const copiedText = document.createElement('span');
            copiedText.textContent = 'Copied!';
            copiedText.style.position = 'absolute';
            copiedText.style.top = '50%';
            copiedText.style.left = '50%';
            copiedText.style.transform = 'translate(-50%, -50%)';
            copiedText.style.backgroundColor = '#ff99cc';
            copiedText.style.color = '#d6006f';
            copiedText.style.padding = '5px 10px';
            copiedText.style.borderRadius = '8px';
            copiedText.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
            copiedText.style.fontSize = '0.9em';
            copiedText.style.fontFamily = 'Comic Sans MS, cursive';
            copiedText.style.opacity = '0';
            copiedText.style.transition = 'opacity 0.5s ease-in-out';

            cell.appendChild(copiedText);

            setTimeout(() => {
                copiedText.style.opacity = '1';
            }, 0);

            setTimeout(() => {
                copiedText.style.opacity = '0';
                setTimeout(() => copiedText.remove(), 500);
            }, 1000);
        });
    });

    const caption = document.querySelector("caption");
    if (caption) {
        caption.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
        });
    }

    const tradeHeader = document.querySelector("th:nth-child(1)"); 
    if (tradeHeader) {
        tradeHeader.addEventListener('click', () => {
            const tradeBody = document.querySelector("#tradeBody");
            const rows = Array.from(tradeBody.querySelectorAll("tr"));
            rows.reverse().forEach(row => tradeBody.appendChild(row));
        });
    }
});
