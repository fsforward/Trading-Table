import sys
import os
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QLineEdit, QPushButton, QFormLayout, QLabel, QHBoxLayout
from PyQt5.QtCore import Qt, QDate

class TradingApp(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowFlags(Qt.FramelessWindowHint)
        self.setWindowTitle("Trading Table Input")

        self.setGeometry(100, 100, 400, 200)

        self.layout = QVBoxLayout()

        title_bar = self.create_title_bar()

        self.form_layout = QFormLayout()
        self.date_input = QLineEdit(self)
        self.date_input.setText(QDate.currentDate().toString("yyyy-MM-dd"))
        self.date_input.setStyleSheet("background-color: #ffb6c1; border-radius: 8px; padding: 2px;")
        self.form_layout.addRow("Date:", self.date_input)

        self.stock_input = QLineEdit(self)
        self.stock_input.setStyleSheet("background-color: #ffb6c1; border-radius: 8px; padding: 2px;")
        self.form_layout.addRow("Stock Name:", self.stock_input)

        self.money_input = QLineEdit(self)
        self.money_input.setStyleSheet("background-color: #ffb6c1; border-radius: 8px; padding: 2px;")
        self.form_layout.addRow("Starter Money:", self.money_input)

        self.pl_input = QLineEdit(self)
        self.pl_input.setStyleSheet("background-color: #ffb6c1; border-radius: 8px; padding: 2px;")
        self.form_layout.addRow("P/L:", self.pl_input)

        self.submit_button = QPushButton("Add Trade", self)
        self.submit_button.setStyleSheet("""
            background-color: #ff66b2; 
            border-radius: 8px; 
            padding: 2px; 
            color: white; 
            font-weight: bold;
        """)
        self.submit_button.clicked.connect(self.add_trade)

        self.layout.addWidget(title_bar)
        self.layout.addLayout(self.form_layout)
        self.layout.addWidget(self.submit_button)

        self.setLayout(self.layout)
        self.setStyleSheet("background-color: #FFC0CB;")
        self.pre_fill_money()

    def create_title_bar(self):
        title_bar = QWidget()
        title_bar.setStyleSheet("background-color: #FFB6C1; height: 30px;")
        title_bar_layout = QHBoxLayout()
        title_bar_layout.setContentsMargins(0, 0, 0, 0)

        title_label = QLabel("Trading Table Input")
        title_label.setStyleSheet("color: #D87A8D;")
        title_bar_layout.addWidget(title_label)

        watermark_label = QLabel("By 사라 (Sarah)")
        watermark_label.setStyleSheet("color: #D87A8D; font-size: 10px;")
        title_bar_layout.addWidget(watermark_label, alignment=Qt.AlignRight)

        close_button = QPushButton("X")
        close_button.setFixedSize(15, 15)
        close_button.setStyleSheet("background-color: #FF69B4; color: white; border: none; font-weight: bold;")
        close_button.clicked.connect(self.close)
        title_bar_layout.addWidget(close_button)

        title_bar.setLayout(title_bar_layout)

        title_bar.mousePressEvent = self.mouse_press_event
        title_bar.mouseMoveEvent = self.mouse_move_event

        return title_bar

    def mouse_press_event(self, event):
        if event.button() == Qt.LeftButton:
            self._drag_start_position = event.globalPos()
            event.accept()

    def mouse_move_event(self, event):
        if hasattr(self, '_drag_start_position'):
            delta = event.globalPos() - self._drag_start_position
            self.move(self.pos() + delta)
            self._drag_start_position = event.globalPos()
            event.accept()

    def pre_fill_money(self):
        html_path = 'index.html'

        if os.path.exists(html_path):
            with open(html_path, 'r') as file:
                html_content = file.read()

            start_index = html_content.find('<tbody id="tradeBody">')
            end_index = html_content.find('</tbody>', start_index)

            if start_index != -1 and end_index != -1:
                tbody_content = html_content[start_index + len('<tbody id="tradeBody">'): end_index]
                rows = tbody_content.split('<tr>')[1:]

                if rows:
                    last_row = rows[-1]
                    columns = last_row.split('</td>')

                    if len(columns) >= 4:
                        starter_money = float(columns[2].split('<td>')[1].strip())
                        pl_value = columns[3].split('<td>')[1].strip()

                        if pl_value.startswith('+'):
                            change = float(pl_value[1:].strip())
                            starter_money += change
                        elif pl_value.startswith('-'):
                            change = float(pl_value[1:].strip())
                            starter_money -= change
                        
                        formatted_money = f"{starter_money:.2f}"
                        self.money_input.setText(formatted_money)

    def add_trade(self):
        date = self.date_input.text()
        stock_name = self.stock_input.text()
        starter_money = self.money_input.text()
        pl = self.pl_input.text()

        new_row = f"            <tr>\n"
        new_row += f"                <td>{date}</td>\n"
        new_row += f"                <td>{stock_name}</td>\n"
        new_row += f"                <td>{starter_money}</td>\n"
        new_row += f"                <td>{pl}</td>\n"
        new_row += f"            </tr>\n"

        html_path = 'index.html'

        if os.path.exists(html_path):
            with open(html_path, 'r') as file:
                html_content = file.readlines()

            for i in range(len(html_content) - 1, -1, -1):
                if "</tbody>" in html_content[i]:
                    html_content.insert(i, new_row)
                    break

            with open(html_path, 'w') as file:
                file.writelines(html_content)

        self.stock_input.clear()
        self.money_input.clear()
        self.pl_input.clear()

        self.pre_fill_money()

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = TradingApp()
    window.show()
    sys.exit(app.exec_())
