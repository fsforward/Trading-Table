document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("caption").addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
    });
    let cumulativeProfit = 0;
    let cumulativeLoss = 0;

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

        row.replaceWith(newRow);  // Replace the old row with the new one

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
});
