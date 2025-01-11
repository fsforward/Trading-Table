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

        // Update existing cells instead of replacing the row entirely
        cells[0].textContent = tradeNumber++;
        cells[1].textContent = date;
        cells[2].textContent = moneyStart.toFixed(2);
        cells[3].textContent = moneyEnd.toFixed(2);
        cells[4].textContent = (pl > 0 ? `+${pl.toFixed(2)}` : pl.toFixed(2));
        cells[5].textContent = totalDayProfit !== 0 ? `+${totalDayProfit.toFixed(2)}` : '0';
        cells[6].textContent = totalDayLoss !== 0 ? `${totalDayLoss.toFixed(2)}` : '0';
        cells[7].textContent = formattedTotalProfit;
        cells[8].textContent = formattedTotalLoss;
        cells[9].textContent = formattedTotal;

        // Highlight cells based on values
        const lastCell = cells[9];
        if (lastCell.textContent.startsWith('+')) {
            lastCell.classList.add('positive-glow');
            lastCell.classList.remove('negative-pulse');
        } else {
            lastCell.classList.remove('positive-glow');
            lastCell.classList.add('negative-pulse');
        }

        cells.forEach(cell => {
            if (cell.textContent.startsWith('+')) {
                cell.classList.add('positive');
                cell.classList.remove('negative');
            } else if (cell.textContent.startsWith('-')) {
                cell.classList.add('negative');
                cell.classList.remove('positive');
            }
        });

        // Apply specific styling for the profit/loss column
        if (pl > 0) {
            cells[4].classList.add('positive');
            cells[4].classList.remove('negative');
        } else if (pl < 0) {
            cells[4].classList.add('negative');
            cells[4].classList.remove('positive');
        }
    });
});

// Allow text selection in table cells
document.addEventListener('copy', function(e) {
    let selectedText = window.getSelection().toString();
    // Modify or format the selectedText if needed before copying
    e.clipboardData.setData('text/plain', selectedText);
    e.preventDefault();
});

// Enable selection of table cells
document.querySelectorAll("table, td").forEach(element => {
    element.style.userSelect = 'text'; // Enable text selection for all table cells
});
