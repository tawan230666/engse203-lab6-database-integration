/** Emit a Socket.IO event if the server attached one (no-op in tests). */
function broadcast(req, event, payload) {
  const io = req.app.get('io');
  if (io) io.emit(event, payload);
}

module.exports = { broadcast };
