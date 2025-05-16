// --- Reservations Section Logic ---
async function fetchTotalReservations() {
  try {
    const response = await fetch('/api/reservations/count');
    if (!response.ok) throw new Error('Failed to fetch total reservations count');
    const { total } = await response.json();
    document.getElementById('totalReservations').textContent = total;
  } catch (error) {
    console.error('Error fetching total reservations count:', error);
  }
}

async function searchReservationById(event) {
  event.preventDefault();
  const reservationId = document.getElementById('reservationSearchInput').value;
  try {
    const response = await fetch(`/api/reservations/${reservationId}`);
    if (!response.ok) throw new Error('Reservation not found');
    const reservation = await response.json();
    document.getElementById('reservationId').textContent = reservation._id;
    document.getElementById('reservationCustomer').textContent = reservation.userId?.name || 'N/A';
    document.getElementById('reservationShop').textContent = reservation.shopId?.shopName || 'N/A';
    document.getElementById('reservationDate').textContent = reservation.reservationDate || 'N/A';
    document.getElementById('reservationTime').textContent = reservation.reservationTime || 'N/A';
    document.getElementById('reservationSeats').textContent = reservation.seats || 'N/A';
    document.getElementById('reservationStatus').textContent = reservation.status || 'N/A';
    document.getElementById('reservationDetails').style.display = 'block';
  } catch (error) {
    console.error('Error fetching reservation:', error);
    alert('Reservation not found');
    document.getElementById('reservationDetails').style.display = 'none';
  }
}

if (document.getElementById('reservationSearchForm')) {
  document.getElementById('reservationSearchForm').addEventListener('submit', searchReservationById);
  fetchTotalReservations();
}
