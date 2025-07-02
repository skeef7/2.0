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
    this.telegramUser = null; // Store Telegram user data
    
    // Roulette items for different costs with sell values
    // DISPLAY ITEMS - показываются на ленте рулетки
    this.displayItems = {
      25: [
        { name: 'Teddy Bear', img: 'IMG/case/Teddy.gif', chance: 21.37, value: 10, sellPrice: 15, rarity: 'common' },
        { name: 'Heart', img: 'IMG/case/Heart.gif', chance: 21.37, value: 25, sellPrice: 15, rarity: 'common' },
        { name: 'Box', img: 'IMG/case/Box.gif', chance: 25, value: 50, sellPrice: 25, rarity: 'rare' },
        { name: 'Rose', img: 'IMG/case/Rose.gif', chance: 25, value: 100, sellPrice: 25, rarity: 'rare' },
        { name: 'Ring', img: 'IMG/case/Ring.gif', chance: 0.806, value: 200, sellPrice: 100, rarity: 'epic' },
        { name: 'Rocket', img: 'IMG/case/Rocket.gif', chance: 1.21, value: 200, sellPrice: 50, rarity: 'epic' },
        { name: 'Сake', img: 'IMG/case/Сake.gif', chance: 1.21, value: 200, sellPrice: 50, rarity: 'epic' },
        { name: 'Сhampagne', img: 'IMG/case/Сhampagne.gif', chance: 1.21, value: 200, sellPrice: 50, rarity: 'epic' },
        { name: 'Сup', img: 'IMG/case/Сup.gif', chance: 0.806, value: 200, sellPrice: 100, rarity: 'epic' },
        { name: 'Diamond', img: 'IMG/case/Diamond.gif', chance: 0.806, value: 200, sellPrice: 100, rarity: 'legendary' },
        { name: 'Flowers', img: 'IMG/case/Flowers.gif', chance: 1.21, value: 200, sellPrice: 50, rarity: 'epic' }
      ],
      50: [
        { name: 'Teddy Bear', img: 'IMG/case/Teddy.gif', chance: 6.97, value: 25, sellPrice: 15, rarity: 'common' },
        { name: 'Heart', img: 'IMG/case/Heart.gif', chance: 6.97, value: 50, sellPrice: 15, rarity: 'common' },
        { name: 'Box', img: 'IMG/case/Box.gif', chance: 11.61, value: 100, sellPrice: 25, rarity: 'rare' },
        { name: 'Rose', img: 'IMG/case/Rose.gif', chance: 11.61, value: 200, sellPrice: 25, rarity: 'rare' },
        { name: 'Ring', img: 'IMG/case/Ring.gif', chance: 5.46, value: 400, sellPrice: 100, rarity: 'epic' },
        { name: 'Rocket', img: 'IMG/case/Rocket.gif', chance: 11.61, value: 200, sellPrice: 50, rarity: 'epic' },
        { name: 'Сake', img: 'IMG/case/Сake.gif', chance: 11.61, value: 200, sellPrice: 50, rarity: 'epic' },
        { name: 'Сhampagne', img: 'IMG/case/Сhampagne.gif', chance: 11.61, value: 200, sellPrice: 50, rarity: 'epic' },
        { name: 'Сup', img: 'IMG/case/Сup.gif', chance: 5.46, value: 200, sellPrice: 100, rarity: 'epic' },
        { name: 'Diamond', img: 'IMG/case/Diamond.gif', chance: 5.46, value: 200, sellPrice: 100, rarity: 'legendary' },
        { name: 'Flowers', img: 'IMG/case/Flowers.gif', chance: 11.61, value: 200, sellPrice: 50, rarity: 'epic' }
      ],
      100: [
        // Common (суммарно 10% вместо ~14% в 50)
        { name: 'Teddy Bear', img: 'IMG/case/Teddy.gif', chance: 5, value: 50, sellPrice: 15, rarity: 'common' },
        { name: 'Heart', img: 'IMG/case/Heart.gif', chance: 5, value: 100, sellPrice: 15, rarity: 'common' },

        // Rare (суммарно 20% вместо ~23% в 50)
        { name: 'Box', img: 'IMG/case/Box.gif', chance: 10, value: 200, sellPrice: 25, rarity: 'rare' },
        { name: 'Rose', img: 'IMG/case/Rose.gif', chance: 10, value: 500, sellPrice: 25, rarity: 'rare' },

        // Epic (значительно усилены)
        { name: 'Ring', img: 'IMG/case/Ring.gif', chance: 8, value: 700, sellPrice: 100, rarity: 'epic' }, // Дорогой предмет
        { name: 'Rocket', img: 'IMG/case/Rocket.gif', chance: 12, value: 200, sellPrice: 50, rarity: 'epic' },
        { name: 'Сake', img: 'IMG/case/Сake.gif', chance: 12, value: 200, sellPrice: 50, rarity: 'epic' },
        { name: 'Сhampagne', img: 'IMG/case/Сhampagne.gif', chance: 12, value: 200, sellPrice: 50, rarity: 'epic' },
        { name: 'Сup', img: 'IMG/case/Сup.gif', chance: 8, value: 200, sellPrice: 100, rarity: 'epic' },
        { name: 'Flowers', img: 'IMG/case/Flowers.gif', chance: 12, value: 200, sellPrice: 50, rarity: 'epic' },

        // Legendary (увеличен в 2 раза относительно 50)
        { name: 'Diamond', img: 'IMG/case/Diamond.gif', chance: 6, value: 200, sellPrice: 100, rarity: 'legendary' }
      ]
    };

    // WIN ITEMS - только эти предметы могут выпасть как выигрыш
    this.winItems = {
      25: [
        { name: 'Teddy Bear', img: 'IMG/case/Teddy.gif', chance: 60, value: 10, sellPrice: 15, rarity: 'common' },
        { name: 'Heart', img: 'IMG/case/Heart.gif', chance: 40, value: 25, sellPrice: 15, rarity: 'common' }
      ],
      50: [
        { name: 'Teddy Bear', img: 'IMG/case/Teddy.gif', chance: 55, value: 25, sellPrice: 15, rarity: 'common' },
        { name: 'Heart', img: 'IMG/case/Heart.gif', chance: 45, value: 50, sellPrice: 15, rarity: 'common' }
      ],
      100: [
        { name: 'Teddy Bear', img: 'IMG/case/Teddy.gif', chance: 50, value: 50, sellPrice: 15, rarity: 'common' },
        { name: 'Heart', img: 'IMG/case/Heart.gif', chance: 50, value: 100, sellPrice: 15, rarity: 'common' }
      ]
    };

    // 💎 DEMO MODE WIN ITEMS - ТОЛЬКО САМЫЕ ДОРОГИЕ ПОДАРКИ!
    this.demoWinItems = {
      25: [
        { name: 'Diamond', img: 'IMG/case/Diamond.gif', chance: 30, value: 200, sellPrice: 100, rarity: 'legendary' },
        { name: 'Ring', img: 'IMG/case/Ring.gif', chance: 25, value: 200, sellPrice: 100, rarity: 'epic' },
        { name: 'Сhampagne', img: 'IMG/case/Сhampagne.gif', chance: 20, value: 200, sellPrice: 50, rarity: 'epic' },
        { name: 'Rocket', img: 'IMG/case/Rocket.gif', chance: 15, value: 200, sellPrice: 50, rarity: 'epic' },
        { name: 'Rose', img: 'IMG/case/Rose.gif', chance: 10, value: 100, sellPrice: 25, rarity: 'rare' }
      ],
      50: [
        { name: 'Ring', img: 'IMG/case/Ring.gif', chance: 35, value: 400, sellPrice: 100, rarity: 'epic' }, // Самый дорогой в 50
        { name: 'Diamond', img: 'IMG/case/Diamond.gif', chance: 25, value: 200, sellPrice: 100, rarity: 'legendary' },
        { name: 'Сhampagne', img: 'IMG/case/Сhampagne.gif', chance: 20, value: 200, sellPrice: 50, rarity: 'epic' },
        { name: 'Rocket', img: 'IMG/case/Rocket.gif', chance: 15, value: 200, sellPrice: 50, rarity: 'epic' },
        { name: 'Rose', img: 'IMG/case/Rose.gif', chance: 5, value: 200, sellPrice: 25, rarity: 'rare' }
      ],
      100: [
        { name: 'Ring', img: 'IMG/case/Ring.gif', chance: 40, value: 700, sellPrice: 100, rarity: 'epic' }, // Самый дорогой в 100
        { name: 'Rose', img: 'IMG/case/Rose.gif', chance: 25, value: 500, sellPrice: 25, rarity: 'rare' }, // Второй по дороговизне
        { name: 'Diamond', img: 'IMG/case/Diamond.gif', chance: 20, value: 200, sellPrice: 100, rarity: 'legendary' },
        { name: 'Сhampagne', img: 'IMG/case/Сhampagne.gif', chance: 10, value: 200, sellPrice: 50, rarity: 'epic' },
        { name: 'Rocket', img: 'IMG/case/Rocket.gif', chance: 5, value: 200, sellPrice: 50, rarity: 'epic' }
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
      
      // Store user data
      this.telegramUser = tg.initDataUnsafe?.user || null;
      
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

    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.navigateToPage('roulette');
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

    // Update spin button with currency emoji
    const spinCostElement = document.querySelector('.spin-cost');
    spinCostElement.innerHTML = `${cost} <img src="IMG/CryptoBotAssets_AgADQ14AAnJguEo.png" alt="star" class="currency-emoji currency-emoji--lg">`;

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

    // ИСПОЛЬЗУЕМ DISPLAY ITEMS для отображения на ленте
    const items = this.displayItems[this.currentCost];
    // УВЕЛИЧИВАЕМ количество элементов для длинной ленты!
    const totalItems = 200; // Гораздо больше элементов для предотвращения "обрыва"

    for (let i = 0; i < totalItems; i++) {
      const item = this.getRandomDisplayItem(items);
      const li = document.createElement('li');
      li.className = 'roulette-item';
      li.dataset.item = JSON.stringify(item);
      
      // НОВЫЙ ДИЗАЙН: Большое фото + цена вместо названия
      li.innerHTML = `
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        <div class="item-price">${item.sellPrice} <img src="IMG/CryptoBotAssets_AgADQ14AAnJguEo.png" alt="star" class="currency-emoji"></div>
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

  // Функция для случайного выбора элемента для ОТОБРАЖЕНИЯ на ленте
  getRandomDisplayItem(items) {
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

  // Функция для случайного выбора элемента для ВЫИГРЫША (только Teddy Bear и Heart)
  getRandomWinItem(items) {
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

    // ПОКАЗЫВАЕМ ШАНСЫ ДЛЯ DISPLAY ITEMS (все призы)
    const items = this.displayItems[this.currentCost];
    
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'chance-item';
      div.setAttribute('data-rarity', item.rarity);
      
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
        <span class="spin-cost">${this.currentCost} <img src="IMG/CryptoBotAssets_AgADQ14AAnJguEo.png" alt="star" class="currency-emoji currency-emoji--lg"></span>
      `;
      return;
    }

    // Выбираем случайный индекс для выигрыша из средней части ленты
    // Это гарантирует, что выигрышный элемент будет в видимой области
    const minIndex = Math.floor(items.length * 0.4); // 40% от начала
    const maxIndex = Math.floor(items.length * 0.6); // 60% от начала
    const winningIndex = Math.floor(Math.random() * (maxIndex - minIndex)) + minIndex;
    
    // ВАЖНО: Определяем выигрышный предмет из WIN ITEMS (только Teddy Bear и Heart)
    const winningItemData = this.getWinningItem();
    if (items[winningIndex]) {
      items[winningIndex].dataset.item = JSON.stringify(winningItemData);
      // ОБНОВЛЯЕМ ДИЗАЙН: Большое фото + цена
      items[winningIndex].innerHTML = `
        <img src="${winningItemData.img}" alt="${winningItemData.name}" loading="lazy">
        <div class="item-price">${winningItemData.sellPrice} <img src="IMG/CryptoBotAssets_AgADQ14AAnJguEo.png" alt="star" class="currency-emoji"></div>
      `;
    }

    // Рассчитываем расстояние для спина
    const itemWidth = 130; // Обновленная ширина элемента для больших изображений
    const containerWidth = list.parentElement.offsetWidth;
    const centerOffset = containerWidth / 2 - itemWidth / 2;
    
    // Рассчитываем финальную позицию так, чтобы выигрышный элемент был в центре
    const targetPosition = -(winningIndex * itemWidth) + centerOffset;
    
    // Добавляем небольшую случайность для естественности (но не слишком много)
    const randomOffset = (Math.random() - 0.5) * 20;
    const finalPosition = targetPosition + randomOffset;

    console.log(`Spinning to index ${winningIndex}, position: ${finalPosition}px, winning item: ${winningItemData.name}`);

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
      <span class="spin-cost">${this.currentCost} <img src="IMG/CryptoBotAssets_AgADQ14AAnJguEo.png" alt="star" class="currency-emoji currency-emoji--lg"></span>
    `;

    this.isSpinning = false;
    this.updateUI();
    this.saveData();
  }

  getWinningItem() {
    // 💎 В ДЕМО РЕЖИМЕ - ТОЛЬКО ДОРОГИЕ ПОДАРКИ!
    if (this.isDemoMode) {
      const items = this.demoWinItems[this.currentCost];
      return this.getRandomWinItem(items);
    }
    
    // ИСПОЛЬЗУЕМ WIN ITEMS для определения выигрыша (только Teddy Bear и Heart)
    const items = this.winItems[this.currentCost];
    return this.getRandomWinItem(items);
  }

  showSellKeepModal(item) {
    const modal = document.getElementById('sellKeepModal');
    const winItem = document.getElementById('sellKeepItem');
    const itemName = document.getElementById('sellKeepItemName');
    const sellPrice = document.getElementById('sellPrice');

    winItem.innerHTML = `<img src="${item.img}" alt="${item.name}">`;
    itemName.textContent = item.name;
    sellPrice.innerHTML = `${item.sellPrice} <img src="IMG/CryptoBotAssets_AgADQ14AAnJguEo.png" alt="star" class="currency-emoji currency-emoji--sm">`;

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
        <div class="item-count">×${item.count}</div>
        <div class="inventory-item-image">
          <img src="${item.img}" alt="${item.name}" loading="lazy">
        </div>
        <div class="inventory-item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-value">${item.sellPrice} <img src="IMG/CryptoBotAssets_AgADQ14AAnJguEo.png" alt="star" class="currency-emoji currency-emoji--sm"></div>
        </div>
        <div class="item-actions">
          <button class="action-btn sell-action-btn" onclick="app.sellInventoryItem('${item.name}')">
            <span class="action-text">Продать</span>
            <span class="action-price">${sellPriceWithCommission} <img src="IMG/CryptoBotAssets_AgADQ14AAnJguEo.png" alt="star" class="currency-emoji currency-emoji--xs"></span>
          </button>
          <button class="action-btn withdraw-action-btn" onclick="app.withdrawInventoryItem('${item.name}')">
            <span class="action-text">Вывод</span>
          </button>
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

  getUserDisplayName() {
    if (this.telegramUser) {
      // Priority: username > first_name + last_name > first_name > "Пользователь"
      if (this.telegramUser.username) {
        return `@${this.telegramUser.username}`;
      } else if (this.telegramUser.first_name) {
        const lastName = this.telegramUser.last_name ? ` ${this.telegramUser.last_name}` : '';
        return `${this.telegramUser.first_name}${lastName}`;
      }
    }
    return 'Пользователь';
  }

  getUserAvatarUrl() {
    if (this.telegramUser && this.telegramUser.photo_url) {
      return this.telegramUser.photo_url;
    }
    return null;
  }

  updateProfileDisplay() {
    // Update username/name
    const profileNameElement = document.querySelector('.profile-name');
    if (profileNameElement) {
      profileNameElement.textContent = this.getUserDisplayName();
    }

    // Update avatar
    const avatarElement = document.querySelector('.avatar-circle');
    if (avatarElement) {
      const avatarUrl = this.getUserAvatarUrl();
      if (avatarUrl) {
        // Show user's Telegram avatar
        avatarElement.innerHTML = `<img src="${avatarUrl}" alt="Avatar" class="avatar-image">`;
      } else {
        // Show default avatar icon
        avatarElement.innerHTML = '👤';
      }
    }

    // Update stats
    document.getElementById('totalSpins').textContent = this.stats.totalSpins;
    document.getElementById('totalWins').textContent = this.stats.totalWins;
    
    // Update balance in profile - MOVED HERE FROM HEADER
    const profileBalanceElement = document.getElementById('profileBalance');
    if (profileBalanceElement) {
      profileBalanceElement.textContent = this.balance;
    }
  }

  updateUI() {
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
      spinCostElement.innerHTML = `${this.currentCost} <img src="IMG/CryptoBotAssets_AgADQ14AAnJguEo.png" alt="star" class="currency-emoji currency-emoji--lg">`;
    }

    // Update profile balance if on profile page
    if (this.currentPage === 'profile') {
      this.updateProfileDisplay();
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