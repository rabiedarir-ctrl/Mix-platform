// frontend/static/pages/zoneDashboard.js

const zonesContainer = document.getElementById('zonesContainer');

// -------------------------------------------
// جلب جميع المناطق من API
// -------------------------------------------
async function fetchZones() {
    try {
        const response = await fetch('/api/zones', { credentials: 'include' });
        if (!response.ok) throw new Error('فشل جلب المناطق');
        return await response.json();
    } catch (error) {
        console.error('Error fetching zones:', error);
        return { zones: {} };
    }
}

// -------------------------------------------
// إنشاء بطاقة منطقة
// -------------------------------------------
function createZoneCard(zoneId, zoneData) {
    const card = document.createElement('div');
    card.className = 'zone-card';
    card.id = `zone-${zoneId}`;

    card.innerHTML = `
        <h2>${zoneData.name} (${zoneId})</h2>
        <div class="zone-status">
            <strong>الطاقة:</strong> <span class="energy">${zoneData.energy.toFixed(2)}</span><br>
            <strong>نوى+:</strong> <span class="nplus">${zoneData.nplus.toFixed(2)}</span><br>
            <strong>نوى-:</strong> <span class="nminus">${zoneData.nminus.toFixed(2)}</span>
        </div>
        <button class="direct" onclick="activateZone('${zoneId}', 'direct')">تفعيل مباشر</button>
        <button class="indirect" onclick="activateZone('${zoneId}', 'indirect')">تفعيل غير مباشر</button>
    `;
    zonesContainer.appendChild(card);
}

// -------------------------------------------
// عرض كل المناطق
// -------------------------------------------
async function renderZones() {
    const data = await fetchZones();
    zonesContainer.innerHTML = '';
    Object.keys(data.zones).forEach(zoneId => {
        createZoneCard(zoneId, data.zones[zoneId]);
    });
}

// -------------------------------------------
// تفعيل منطقة عبر API
// -------------------------------------------
async function activateZone(zoneId, actionType) {
    const value = parseFloat(prompt('ادخل قيمة التفعيل:', '10'));
    if (!value || value <= 0) return alert('قيمة غير صالحة');

    try {
        const response = await fetch(`/api/zones/activate/${zoneId}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value, actionType })
        });
        const result = await response.json();
        if (response.ok) {
            updateZoneCard(zoneId, result.zone);
        } else {
            alert(result.error || 'حدث خطأ أثناء التفعيل');
        }
    } catch (error) {
        console.error('Error activating zone:', error);
    }
}

// -------------------------------------------
// تحديث بطاقة المنطقة بعد التفعيل أو التحديث اللحظي
// -------------------------------------------
function updateZoneCard(zoneId, zoneData) {
    const card = document.getElementById(`zone-${zoneId}`);
    if (!card) return;

    card.querySelector('.energy').textContent = zoneData.energy.toFixed(2);
    card.querySelector('.nplus').textContent = zoneData.nplus.toFixed(2);
    card.querySelector('.nminus').textContent = zoneData.nminus.toFixed(2);
}

// -------------------------------------------
// WebSocket للتحديث اللحظي عبر EventBus
// -------------------------------------------
let socket;
function initWebSocket() {
    socket = new WebSocket('ws://localhost:3000'); // عدل حسب إعدادات السيرفر

    socket.addEventListener('open', () => {
        console.log('WebSocket متصل');
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'zone.activated') {
            updateZoneCard(data.zoneId, data);
        }
    });

    socket.addEventListener('close', () => {
        console.log('WebSocket مغلق، محاولة إعادة الاتصال خلال 5 ثواني...');
        setTimeout(initWebSocket, 5000);
    });

    socket.addEventListener('error', (err) => {
        console.error('WebSocket error:', err);
        socket.close();
    });
}

// -------------------------------------------
// بدء تشغيل الـ Dashboard
// -------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
    renderZones();
    initWebSocket();
});
