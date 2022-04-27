const Database = require('../db/config')

module.exports = {
  async create(req, res) {
    const db = await Database()
    const pass = req.body.password
    let roomId = ''
    let isRoom = true

    while (isRoom) {
      // Gera o numero da sala
      for (let i = 0; i < 6; i++)
        roomId += Math.floor(Math.random() * 10).toString()

      // Verificar se o numero ja existe
      const roomsExistIds = await db.all(`SELECT id FROM rooms`)
      isRoom = roomsExistIds.some(roomExistId => roomExistId === roomId)
    }

    // Insere sala no banco
    await db.run(
      `INSERT INTO rooms(id, pass) VALUES (${parseInt(roomId)}, ${pass})`
    )

    await db.close()

    return res.redirect(`/room/${roomId}`)
  },

  async open(req, res) {
    const db = await Database()
    const roomId = req.params.room

    const questions = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} ORDER BY read`
    )

    let isQuestions = questions.length > 0

    await db.close()

    return res.render('room', { roomId, questions, isQuestions })
  },

  enter(req, res) {
    const roomId = req.body.roomId

    return res.redirect(`/room/${roomId}`)
  }
}
