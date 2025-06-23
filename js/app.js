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
    
    // Roulette items for different costs with sell values
    this.rouletteItems = {
      25: [
        { name: 'Teddy Bear', img: 'IMG/case/Teddy.gif', chance: 25, value: 10, sellPrice: 15, rarity: 'common' },
        { name: 'Heart', img: 'IMG/case/Heart.gif', chance: 25, value: 25, sellPrice: 30, rarity: 'common' },
        { name: 'Box', img: 'IMG/case/Box.gif', chance: 30, value: 50, sellPrice: 40, rarity: 'rare' },
        { name: 'Rose', img: 'IMG/case/Rose.gif', chance: 30, value: 100, sellPrice: 80, rarity: 'rare' },
        { name: 'Ring', img: 'IMG/case/Ring.gif', chance: 0.806, value: 200, sellPrice: 150, rarity: 'epic' },
        { name: 'Rocket', img: 'IMG/case/Rocket.gif', chance: 0.806, value: 200, sellPrice: 160, rarity: 'epic' },
        { name: 'Сake', img: 'IMG/case/Сake.gif', chance: 0.806, value: 200, sellPrice: 140, rarity: 'epic' },
        { name: 'Сhampagne', img: 'IMG/case/Сhampagne.gif', chance: 0.806, value: 200, sellPrice: 170, rarity: 'epic' },
        { name: 'Сup', img: 'IMG/case/Сup.gif', chance: 0.806, value: 200, sellPrice: 130, rarity: 'epic' },
        { name: 'Diamond', img: 'IMG/case/Diamond.gif', chance: 0.806, value: 200, sellPrice: 180, rarity: 'legendary' },
        { name: 'Flowers', img: 'IMG/case/Flowers.gif', chance: 0.806, value: 200, sellPrice: 120, rarity: 'epic' }
      ],
      50: [
        { name: 'Teddy Bear', img: 'IMG/case/Teddy.gif', chance: 40, value: 25, sellPrice: 35, rarity: 'common' },
        { name: 'Heart', img: 'IMG/case/Heart.gif', chance: 35, value: 50, sellPrice: 60, rarity: 'common' },
        { name: 'Box', img: 'IMG/case/Box.gif', chance: 20, value: 100, sellPrice: 85, rarity: 'rare' },
        { name: 'Rose', img: 'IMG/case/Rose.gif', chance: 5, value: 200, sellPrice: 170, rarity: 'rare' },
        { name: 'Ring', img: 'IMG/case/Ring.gif', chance: 1, value: 400, sellPrice: 320, rarity: 'epic' },
        { name: 'Rocket', img: 'IMG/case/Rocket.gif', chance: 0.806, value: 200, sellPrice: 180, rarity: 'epic' },
        { name: 'Сake', img: 'IMG/case/Сake.gif', chance: 0.806, value: 200, sellPrice: 160, rarity: 'epic' },
        { name: 'Сhampagne', img: 'IMG/case/Сhampagne.gif', chance: 0.806, value: 200, sellPrice: 190, rarity: 'epic' },
        { name: 'Сup', img: 'IMG/case/Сup.gif', chance: 0.806, value: 200, sellPrice: 150, rarity: 'epic' },
        { name: 'Diamond', img: 'IMG/case/Diamond.gif', chance: 0.806, value: 200, sellPrice: 200, rarity: 'legendary' },
        { name: 'Flowers', img: 'IMG/case/Flowers.gif', chance: 0.806, value: 200, sellPrice: 140, rarity: 'epic' }
      ],
      100: [
        { name: 'Teddy Bear', img: 'IMG/case/Teddy.gif', chance: 35, value: 50, sellPrice: 70, rarity: 'common' },
        { name: 'Heart', img: 'IMG/case/Heart.gif', chance: 30, value: 100, sellPrice: 120, rarity: 'common' },
        { name: 'Box', img: 'IMG/case/Box.gif', chance: 25, value: 200, sellPrice: 170, rarity: 'rare' },
        { name: 'Rose', img: 'IMG/case/Rose.gif', chance: 10, value: 500, sellPrice: 400, rarity: 'rare' },
        { name: 'Ring', img: 'IMG/case/Ring.gif', chance: 1, value: 700, sellPrice: 550, rarity: 'epic' },
        { name: 'Rocket', img: 'IMG/case/Rocket.gif', chance: 0.806, value: 200, sellPrice: 180, rarity: 'epic' },
        { name: 'Сake', img: 'IMG/case/Сake.gif', chance: 0.806, value: 200, sellPrice: 160, rarity: 'epic' },
        { name: 'Сhampagne', img: 'IMG/case/Сhampagne.gif', chance: 0.806, value: 200, sellPrice: 190, rarity: 'epic' },
        { name: 'Сup', img: 'IMG/case/Сup.gif', chance: 0.806, value: 200, sellPrice: 150, rarity: 'epic' },
        { name: 'Diamond', img: 'IMG/case/Diamond.gif', chance: 0.806, value: 200, sellPrice: 200, rarity: 'legendary' },
        { name: 'Flowers', img: 'IMG/case/Flowers.gif', chance: 0.806, value: 200, sellPrice: 140, rarity: 'epic' }
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

    // Update spin button with PNG currency
    const spinCostElement = document.querySelector('.spin-cost');
    spinCostElement.innerHTML = `${cost} <img src="IMG/CryptoBotAssets_AgADQ14AAnJguEo.png" alt="star" class="currency-icon">`;

    // Regenerate items and update chances
    this.generateRouletteItems();
    this.updateChancesList();
    
    this.hapticFeedback();
  }

  generateRouletteItems() {
    const list = document.querySelector('.roulette-list');
    if (!list) return;
    
    // Сбрасываем позицию и очищаем активные классы
    list.style.transition = 'none';
    list.style.transform = 'translateX(0px)';
    
    // Принудительно применяем стили
    list.offsetHeight;
    
    // Очищаем содержимое
    list.innerHTML = '';

    const items = this.rouletteItems[this.currentCost];
    // УВЕЛИЧИВАЕМ количество элементов для длинной ленты!
    const totalItems = 200; // Гораздо больше элементов для предотвращения "обрыва"

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
      if (list) {
        list.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
      }
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

    // Генерируем новую ленту для каждого спина
    this.generateRouletteItems();
    
    // Ждем немного для применения стилей
    await new Promise(resolve => setTimeout(resolve, 100));

    const list = document.querySelector('.roulette-list');
    const items = list.querySelectorAll('.roulette-item');
    
    if (items.length === 0) {
      console.error('No roulette items found');
      this.isSpinning = false;
      spinBtn.disabled = false;
      spinBtn.innerHTML = `
        <span class="spin-text">Мне повезёт!</span>
        <span class="spin-cost">${this.currentCost} <img src="IMG/CryptoBotAssets_AgADQ14AAnJguEo.png" alt="star" class="currency-icon"></span>
      `;
      return;
    }

    // Выбираем случайный индекс для выигрыша из средней части ленты
    // Это гарантирует, что выигрышный элемент будет в видимой области
    const minIndex = Math.floor(items.length * 0.4); // 40% от начала
    const maxIndex = Math.floor(items.length * 0.6); // 60% от начала
    const winningIndex = Math.floor(Math.random() * (maxIndex - minIndex)) + minIndex;
    
    // Определяем выигрышный предмет и обновляем его данные
    const winningItemData = this.getWinningItem();
    if (items[winningIndex]) {
      items[winningIndex].dataset.item = JSON.stringify(winningItemData);
      items[winningIndex].innerHTML = `
        <img src="${winningItemData.img}" alt="${winningItemData.name}" loading="lazy">
        <div class="item-name">${winningItemData.name}</div>
      `;
    }

    // Рассчитываем расстояние для спина
    const itemWidth = 100;
    const containerWidth = list.parentElement.offsetWidth;
    const centerOffset = containerWidth / 2 - itemWidth / 2;
    
    // Рассчитываем финальную позицию так, чтобы выигрышный элемент был в центре
    const targetPosition = -(winningIndex * itemWidth) + centerOffset;
    
    // Добавляем небольшую случайность для естественности (но не слишком много)
    const randomOffset = (Math.random() - 0.5) * 20;
    const finalPosition = targetPosition + randomOffset;

    console.log(`Spinning to index ${winningIndex}, position: ${finalPosition}px`);

    // Запускаем анимацию спина
    list.style.transform = `translateX(${finalPosition}px)`;

    // Ждем завершения анимации
    await new Promise(resolve => setTimeout(resolve, 4200));

    // Отмечаем выигрышный элемент как активный
    items.forEach(item => item.classList.remove('active'));
    if (items[winningIndex]) {
      items[winningIndex].classList.add('active');
    }

    // Обрабатываем выигрыш
    if (!this.isDemoMode) {
      this.stats.totalWins++;
      // Show sell/keep modal instead of directly adding to inventory
      this.showSellKeepModal(winningItemData);
    } else {
      this.showWinModal(winningItemData);
    }
    
    // Сбрасываем кнопку
    spinBtn.disabled = false;
    spinBtn.innerHTML = `
      <span class="spin-text">Мне повезёт!</span>
      <span class="spin-cost">${this.currentCost} <img src="IMG/CryptoBotAssets_AgADQ14AAnJguEo.png" alt="star" class="currency-icon"></span>
    `;

    this.isSpinning = false;
    this.updateUI();
    this.saveData();
  }

  getWinningItem() {
    const items = this.rouletteItems[this.currentCost];
    return this.getRandomItem(items);
  }

  showSellKeepModal(item) {
    const modal = document.getElementById('sellKeepModal');
    const winItem = document.getElementById('sellKeepItem');
    const itemName = document.getElementById('sellKeepItemName');
    const sellPrice = document.getElementById('sellPrice');

    winItem.innerHTML = `<img src="${item.img}" alt="${item.name}">`;
    itemName.textContent = item.name;
    sellPrice.innerHTML = `${item.sellPrice} <img src="IMG/CryptoBotAssets_AgADQ14AAnJguEo.png" alt="star" class="currency-icon">`;

    // Store current item for sell/keep actions
    this.currentWinItem = item;

    modal.classList.add('active');
    this.hapticFeedback();
  }

  sellItem() {
    if (this.currentWinItem) {
      // Capture the sellPrice before closing the modal
      const sellPrice = this.currentWinItem.sellPrice;
      this.balance += sellPrice;
      this.closeSellKeepModal();
      this.showNotification(`Продано за ${sellPrice} звёзд!`);
      this.updateUI();
      this.saveData();
    }
  }

  keepItem() {
    if (this.currentWinItem) {
      // Capture the item name before closing the modal
      const itemName = this.currentWinItem.name;
      this.addToInventory(this.currentWinItem);
      this.closeSellKeepModal();
      this.showNotification(`${itemName} добавлен в инвентарь!`);
      this.saveData();
    }
  }

  closeSellKeepModal() {
    const modal = document.getElementById('sellKeepModal');
    modal.classList.remove('active');
    this.currentWinItem = null;
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

  // Sell item from inventory with 14% commission
  sellInventoryItem(itemName) {
    if (this.inventory[itemName] && this.inventory[itemName].count > 0) {
      const item = this.inventory[itemName];
      const sellPrice = Math.floor(item.sellPrice * 0.86); // 14% commission
      
      this.balance += sellPrice;
      this.inventory[itemName].count--;
      
      if (this.inventory[itemName].count === 0) {
        delete this.inventory[itemName];
      }
      
      this.updateInventoryDisplay();
      this.updateUI();
      this.saveData();
      this.showNotification(`Продано за ${sellPrice} звёзд! (комиссия 14%)`);
      this.hapticFeedback();
    }
  }

  // Withdraw item from inventory (placeholder for future functionality)
  withdrawInventoryItem(itemName) {
    this.showNotification('Функция вывода будет доступна в следующем обновлении!');
    this.hapticFeedback();
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
      const sellPriceWithCommission = Math.floor(item.sellPrice * 0.86); // 14% commission
      
      const div = document.createElement('div');
      div.className = `inventory-item ${item.rarity || 'common'}`;
      
      div.innerHTML = `
        <div class="item-header">
          <div class="item-count">×${item.count}</div>
          <div class="item-value">${item.sellPrice} <img src="IMG/CryptoBotAssets_AgADQ14AAnJguEo.png" alt="star" class="currency-icon-small"></div>
        </div>
        <div class="item-image">
          <img src="${item.img}" alt="${item.name}" loading="lazy">
        </div>
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-actions">
            <button class="action-btn sell-btn" onclick="app.sellInventoryItem('${item.name}')">
              <span class="btn-icon">💰</span>
              <span class="btn-text">Продать</span>
              <span class="btn-price">${sellPriceWithCommission}</span>
            </button>
            <button class="action-btn withdraw-btn" onclick="app.withdrawInventoryItem('${item.name}')">
              <span class="btn-icon">📤</span>
              <span class="btn-text">Вывод</span>
            </button>
          </div>
        </div>
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
    
    // Update balance in profile stats with PNG currency
    const balanceStatValue = document.querySelector('.stat-value');
    if (balanceStatValue) {
      balanceStatValue.innerHTML = `${this.balance} <img src="IMG/CryptoBotAssets_AgADQ14AAnJguEo.png" alt="star" class="currency-icon">`;
    }
  }

  updateUI() {
    // Update balance with PNG currency
    const balanceAmount = document.querySelector('.balance-amount');
    balanceAmount.textContent = this.balance;
    
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
    const spinCostElement = document.querySelector('.spin-cost');
    if (this.isDemoMode) {
      spinCostElement.textContent = '🆓';
    } else {
      spinCostElement.innerHTML = `${this.currentCost} <img src="IMG/CryptoBotAssets_AgADQ14AAnJguEo.png" alt="star" class="currency-icon">`;
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

// Global functions for modals
window.closeWinModal = function() {
  app.closeWinModal();
};

window.closeSellKeepModal = function() {
  app.closeSellKeepModal();
};

window.sellItem = function() {
  app.sellItem();
};

window.keepItem = function() {
  app.keepItem();
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