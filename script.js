document.addEventListener('DOMContentLoaded', () => {
    // Toggle dark/light mode when caption is clicked
    document.querySelector("caption").addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
    });
    let cumulativeProfit = 0;
    let cumulativeLoss = 0;

    // Copy Functionality for Table Cells
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

    // Auto Trade Table Calculation
    function automateTrades() {
        const rows = document.querySelectorAll("#tradeBody tr");
        let tradeNumber = 1;
        let totalDayProfit = 0;
        let totalDayLoss = 0;
        let previousDay = '';
        let cumulativeTotal = 0;

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            let [date, stock, moneyStart, pl] = [
                cells[1].textContent,
                cells[2].textContent,
                parseFloat(cells[3].textContent),
                parseFloat(cells[5].textContent) // manually entered P/L
            ];

            // Reset totals if new day
            if (previousDay !== date) {
                totalDayProfit = 0;
                totalDayLoss = 0;
                previousDay = date;
            }

            // Money End Calculation
            const moneyEnd = moneyStart + pl;
            if (pl > 0) {
                totalDayProfit += pl;
                cumulativeProfit += pl;
            } else {
                totalDayLoss += pl; // Accumulate losses correctly
                cumulativeLoss += pl;
            }

            cumulativeTotal = cumulativeProfit + cumulativeLoss;

            // Format profit and loss for the display (with "+" for positive numbers)
            const formattedTotalProfit = cumulativeProfit > 0 ? `+${cumulativeProfit.toFixed(2)}` : cumulativeProfit.toFixed(2);
            const formattedTotalLoss = cumulativeLoss < 0 ? `-${Math.abs(cumulativeLoss).toFixed(2)}` : `+${cumulativeLoss.toFixed(2)}`;
            const formattedTotal = cumulativeTotal > 0 ? `+${cumulativeTotal.toFixed(2)}` : cumulativeTotal.toFixed(2);

            // Update table row
            cells[0].textContent = tradeNumber++;
            cells[4].textContent = moneyEnd.toFixed(2);
            cells[6].textContent = totalDayProfit !== 0 ? `+${totalDayProfit.toFixed(2)}` : '0';
            cells[7].textContent = totalDayLoss !== 0 ? `${totalDayLoss.toFixed(2)}` : '0';
            cells[8].textContent = formattedTotalProfit;
            cells[9].textContent = formattedTotalLoss;
            cells[10].textContent = formattedTotal;

            // Add glow effect only for positive profit in the 10th column (Total column)
            if (cells[10].textContent.startsWith('+')) {
                cells[10].classList.add('positive-glow');
                cells[10].classList.remove('negative-pulse');
            } else {
                cells[10].classList.remove('positive-glow');
                cells[10].classList.add('negative-pulse');
            }

            // Apply CSS classes for color
            [cells[6], cells[7], cells[8], cells[9], cells[10]].forEach(cell => {
                if (cell.textContent.startsWith('+')) {
                    cell.classList.add('positive');
                    cell.classList.remove('negative');
                } else if (cell.textContent.startsWith('-')) {
                    cell.classList.add('negative');
                    cell.classList.remove('positive');
                }
            });

            // Apply coloring to manually entered P/L (cell 5)
            if (pl > 0) {
                cells[5].classList.add('positive');
                cells[5].classList.remove('negative');
            } else if (pl < 0) {
                cells[5].classList.add('negative');
                cells[5].classList.remove('positive');
            }
        });
    }

    // Trigger table automation
    automateTrades();
});
