class TelegramRouletteApp {
  constructor() {
    this.balance = 1000;
    this.currentCost = 25;
    this.isSpinning = false;
    this.isDemoMode = false;
    this.currentPage = 'roulette';
    this.inventory = {};
    this.stats = {
      totalSpins: 0,
      totalWins: 0
    };
    
    // Roulette items for different costs
    this.rouletteItems = {
      25: [
        { name: 'Teddy Bear', img: 'IMG/case/Teddy.gif', chance: 45, value: 10 },
        { name: 'Heart', img: 'IMG/case/Heart.gif', chance: 45, value: 25 },
        { name: 'Box', img: 'IMG/case/Box.gif', chance: 20, value: 50 },
        { name: 'Rose', img: 'IMG/case/Rose.gif', chance: 5, value: 100 }
      ],
      50: [
        { name: 'Teddy Bear', img: 'IMG/case/Teddy.gif', chance: 40, value: 25 },
        { name: 'Heart', img: 'IMG/case/Heart.gif', chance: 35, value: 50 },
        { name: 'Box', img: 'IMG/case/Box.gif', chance: 20, value: 100 },
        { name: 'Rose', img: 'IMG/case/Rose.gif', chance: 5, value: 200 }
      ],
      100: [
        { name: 'Teddy Bear', img: 'IMG/case/Teddy.gif', chance: 35, value: 50 },
        { name: 'Heart', img: 'IMG/case/Heart.gif', chance: 30, value: 100 },
        { name: 'Box', img: 'IMG/case/Box.gif', chance: 25, value: 200 },
        { name: 'Rose', img: 'IMG/case/Rose.gif', chance: 10, value: 500 }
      ]
    };

    this.init();
  }

  init() {
    this.initTelegram();
    this.setupEventListeners();
    this.generateRouletteItems();
    this.updateChancesList();
    this.updateUI();
    this.loadData();
  }

  initTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Set theme colors
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#17212b');
      document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#708499');
      document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#6ab7ff');
      document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#5288c1');
      document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#232e3c');
    }
  }

  setupEventListeners() {
    // Roulette type selector
    document.querySelectorAll('.roulette-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cost = parseInt(e.currentTarget.dataset.cost);
        this.selectRouletteCost(cost);
      });
    });

    // Demo mode toggle
    document.getElementById('demoMode').addEventListener('change', (e) => {
      this.isDemoMode = e.target.checked;
      this.updateUI();
    });

    // Spin button
    document.getElementById('spinBtn').addEventListener('click', () => {
      this.spin();
    });

    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = e.currentTarget.dataset.page;
        this.navigateToPage(page);
      });
    });

    // Prevent context menu and text selection
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('selectstart', e => e.preventDefault());
  }

  selectRouletteCost(cost) {
    if (this.isSpinning) return;

    this.currentCost = cost;
    
    // Update active button
    document.querySelectorAll('.roulette-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-cost="${cost}"]`).classList.add('active');

    // Update spin button
    document.querySelector('.spin-cost').textContent = `${cost} ✵`;

    // Regenerate items and update chances
    this.generateRouletteItems();
    this.updateChancesList();
    
    this.hapticFeedback();
  }

  generateRouletteItems() {
    const list = document.querySelector('.roulette-list');
    if (!list) return;
    
    // Сначала сбрасываем позицию и очищаем активные классы
    list.style.transition = 'none';
    list.style.transform = 'translateX(0px)';
    
    // Принудительно применяем стили
    list.offsetHeight;
    
    // Очищаем содержимое
    list.innerHTML = '';

    const items = this.rouletteItems[this.currentCost];
    const totalItems = 31; // Нечетное число для лучшего центрирования

    for (let i = 0; i < totalItems; i++) {
      const item = this.getRandomItem(items);
      const li = document.createElement('li');
      li.className = 'roulette-item';
      li.dataset.item = JSON.stringify(item);
      
      li.innerHTML = `
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        <div class="item-name">${item.name}</div>
      `;

      list.appendChild(li);
    }

    // Возвращаем transition после небольшой задержки
    setTimeout(() => {
      list.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    }, 50);
  }

  getRandomItem(items) {
    const random = Math.random() * 100;
    let cumulativeChance = 0;

    for (const item of items) {
      cumulativeChance += item.chance;
      if (random <= cumulativeChance) {
        return item;
      }
    }

    return items[items.length - 1]; // Fallback
  }

  updateChancesList() {
    const chancesList = document.getElementById('chancesList');
    chancesList.innerHTML = '';

    const items = this.rouletteItems[this.currentCost];
    
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'chance-item';
      
      div.innerHTML = `
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        <div class="chance-name">${item.name}</div>
        <div class="chance-percent">${item.chance}% 🎯</div>
      `;

      chancesList.appendChild(div);
    });
  }

  async spin() {
    if (this.isSpinning) return;
    
    // Check balance in non-demo mode
    if (!this.isDemoMode && this.balance < this.currentCost) {
      this.showNotification('Недостаточно средств!');
      return;
    }

    this.isSpinning = true;
    this.stats.totalSpins++;

    // Deduct cost in non-demo mode
    if (!this.isDemoMode) {
      this.balance -= this.currentCost;
    }

    this.updateUI();
    this.hapticFeedback();

    // Disable button and show loading
    const spinBtn = document.getElementById('spinBtn');
    spinBtn.disabled = true;
    spinBtn.innerHTML = '<div class="loading"></div>';

    // НЕ генерируем новые элементы во время спина!
    // Используем существующие элементы
    const list = document.querySelector('.roulette-list');
    const items = list.querySelectorAll('.roulette-item');
    
    if (items.length === 0) {
      // Если элементов нет, генерируем их
      this.generateRouletteItems();
      // Ждем немного для применения стилей
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Получаем обновленный список элементов
    const updatedItems = list.querySelectorAll('.roulette-item');
    const winningIndex = Math.floor(updatedItems.length / 2); // Средний элемент
    
    // Определяем выигрышный предмет заранее и обновляем его данные
    const winningItemData = this.getWinningItem();
    if (updatedItems[winningIndex]) {
      updatedItems[winningIndex].dataset.item = JSON.stringify(winningItemData);
      updatedItems[winningIndex].innerHTML = `
        <img src="${winningItemData.img}" alt="${winningItemData.name}" loading="lazy">
        <div class="item-name">${winningItemData.name}</div>
      `;
    }

    // Рассчитываем расстояние для спина
    const itemWidth = 100;
    const containerWidth = list.parentElement.offsetWidth;
    const centerOffset = containerWidth / 2 - itemWidth / 2;
    
    // Добавляем несколько полных оборотов для реалистичности
    const fullRotations = 3 + Math.random() * 2; // 3-5 полных оборотов
    const totalDistance = fullRotations * (itemWidth * updatedItems.length);
    const targetPosition = -(winningIndex * itemWidth) + centerOffset;
    const finalPosition = -totalDistance + targetPosition;
    
    // Добавляем небольшую случайность для естественности
    const randomOffset = (Math.random() - 0.5) * 30;
    const spinDistance = finalPosition + randomOffset;

    // Запускаем анимацию спина
    list.style.transform = `translateX(${spinDistance}px)`;

    // Ждем завершения анимации
    await new Promise(resolve => setTimeout(resolve, 4200));

    // Отмечаем выигрышный элемент как активный
    updatedItems.forEach(item => item.classList.remove('active'));
    if (updatedItems[winningIndex]) {
      updatedItems[winningIndex].classList.add('active');
    }

    // Обрабатываем выигрыш
    if (!this.isDemoMode) {
      this.addToInventory(winningItemData);
      this.stats.totalWins++;
    }

    this.showWinModal(winningItemData);
    
    // Сбрасываем кнопку
    spinBtn.disabled = false;
    spinBtn.innerHTML = `
      <span class="spin-text">Мне повезёт!</span>
      <span class="spin-cost">${this.currentCost} ✵</span>
    `;

    this.isSpinning = false;
    this.updateUI();
    this.saveData();
  }

  getWinningItem() {
    const items = this.rouletteItems[this.currentCost];
    return this.getRandomItem(items);
  }

  addToInventory(item) {
    const key = item.name;
    if (this.inventory[key]) {
      this.inventory[key].count++;
    } else {
      this.inventory[key] = {
        ...item,
        count: 1
      };
    }
    this.updateInventoryDisplay();
  }

  updateInventoryDisplay() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    
    if (Object.keys(this.inventory).length === 0) {
      inventoryGrid.innerHTML = `
        <div class="empty-inventory">
          <div class="empty-icon">📦</div>
          <p>Ваш инвентарь пуст</p>
          <p class="empty-subtitle">Крутите рулетку, чтобы получить призы!</p>
        </div>
      `;
      return;
    }

    inventoryGrid.innerHTML = '';
    
    Object.values(this.inventory).forEach(item => {
      const div = document.createElement('div');
      div.className = 'inventory-item';
      
      div.innerHTML = `
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        <div class="item-name">${item.name}</div>
        <div class="item-count">×${item.count}</div>
      `;

      inventoryGrid.appendChild(div);
    });
  }

  showWinModal(item) {
    const modal = document.getElementById('winModal');
    const winItem = document.getElementById('winItem');
    const winDescription = document.getElementById('winDescription');

    winItem.innerHTML = `<img src="${item.img}" alt="${item.name}">`;
    winDescription.textContent = `Вы выиграли: ${item.name}!`;

    modal.classList.add('active');
    this.hapticFeedback();
  }

  closeWinModal() {
    const modal = document.getElementById('winModal');
    modal.classList.remove('active');
  }

  navigateToPage(page) {
    if (page === this.currentPage) return;

    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    if (page !== 'roulette') {
      document.querySelector(`[data-page="${page}"]`).classList.add('active');
    } else {
      document.querySelector(`[data-page="roulette"]`).classList.add('active');
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
    });

    // Show target page
    if (page !== 'roulette') {
      document.getElementById(`${page}Page`).classList.add('active');
    }

    this.currentPage = page;
    this.hapticFeedback();

    // Update page-specific content
    if (page === 'inventory') {
      this.updateInventoryDisplay();
    } else if (page === 'profile') {
      this.updateProfileDisplay();
    }
  }

  updateProfileDisplay() {
    document.getElementById('totalSpins').textContent = this.stats.totalSpins;
    document.getElementById('totalWins').textContent = this.stats.totalWins;
    
    // Update balance in profile stats
    const balanceStatValue = document.querySelector('.stat-value');
    if (balanceStatValue) {
      balanceStatValue.textContent = `${this.balance} ✵`;
    }
  }

  updateUI() {
    // Update balance
    document.querySelector('.balance-amount').textContent = this.balance;
    
    // Update spin button state
    const spinBtn = document.getElementById('spinBtn');
    if (!this.isDemoMode && this.balance < this.currentCost) {
      spinBtn.style.opacity = '0.5';
      spinBtn.style.cursor = 'not-allowed';
    } else {
      spinBtn.style.opacity = '1';
      spinBtn.style.cursor = 'pointer';
    }

    // Update demo mode indicator
    const demoToggle = document.getElementById('demoMode');
    if (this.isDemoMode) {
      document.querySelector('.spin-cost').textContent = '🆓';
    } else {
      document.querySelector('.spin-cost').textContent = `${this.currentCost} ✵`;
    }
  }

  showNotification(message) {
    // Simple notification system
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--tg-theme-section-bg-color);
      color: var(--tg-theme-text-color);
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: var(--shadow-primary);
      z-index: 1001;
      font-size: 14px;
      font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  hapticFeedback() {
    // Telegram haptic feedback
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    
    // Visual feedback for web
    document.body.classList.add('haptic');
    setTimeout(() => {
      document.body.classList.remove('haptic');
    }, 100);
  }

  saveData() {
    const data = {
      balance: this.balance,
      inventory: this.inventory,
      stats: this.stats
    };
    localStorage.setItem('telegramRouletteData', JSON.stringify(data));
  }

  loadData() {
    const saved = localStorage.getItem('telegramRouletteData');
    if (saved) {
      const data = JSON.parse(saved);
      this.balance = data.balance || 1000;
      this.inventory = data.inventory || {};
      this.stats = data.stats || { totalSpins: 0, totalWins: 0 };
    }
    this.updateUI();
    this.updateInventoryDisplay();
    this.updateProfileDisplay();
  }
}

// Global function for modal
window.closeWinModal = function() {
  app.closeWinModal();
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TelegramRouletteApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && window.app) {
    window.app.updateUI();
  }
});