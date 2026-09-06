export const spldvTemplateUjian = {
  id: "ujn_spldv_01",
  materiId: "mat_1", 
  title: "Ujian Akhir: Konsep Dasar SPLDV",
  desc: "Kerjakan 20 soal berikut dengan teliti. Waktu pengerjaan 90 menit. Kamu bisa melampirkan foto coretan perhitungan pada soal uraian.",
  duration: 90, // Durasi telah diubah menjadi 90 menit
  isDeleted: false,
  questions: [
    {
      id: "q_u1",
      type: "multiple_choice",
      content: "Penyelesaian dari sistem persamaan $x + y = 5$ dan $x - y = 1$ adalah ....",
      options: [
        { id: "o1", text: "$x = 3, y = 2$", isCorrect: true },
        { id: "o2", text: "$x = 2, y = 3$", isCorrect: false },
        { id: "o3", text: "$x = 4, y = 1$", isCorrect: false },
        { id: "o4", text: "$x = 1, y = 4$", isCorrect: false }
      ]
    },
    {
      id: "q_u2",
      type: "multiple_choice",
      content: "Diketahui sistem persamaan $2x + y = 7$ dan $x + y = 5$. Nilai $x$ adalah ....",
      options: [
        { id: "o1", text: "1", isCorrect: false },
        { id: "o2", text: "2", isCorrect: true },
        { id: "o3", text: "3", isCorrect: false },
        { id: "o4", text: "4", isCorrect: false }
      ]
    },
    {
      id: "q_u3",
      type: "short_answer",
      content: "Tentukan nilai $y$ dari sistem persamaan $3x + y = 10$ dan $x + y = 4$.",
      correctAnswer: "1"
    },
    {
      id: "q_u4",
      type: "multiple_choice",
      content: "Jika $x$ dan $y$ memenuhi sistem persamaan $2x - y = 3$ dan $x + y = 6$, maka nilai $x + y$ adalah ....",
      options: [
        { id: "o1", text: "3", isCorrect: false },
        { id: "o2", text: "5", isCorrect: false },
        { id: "o3", text: "6", isCorrect: true },
        { id: "o4", text: "7", isCorrect: false }
      ]
    },
    {
      id: "q_u5",
      type: "short_answer",
      content: "Himpunan penyelesaian dari $x + 2y = 8$ dan $x + y = 5$. Berapakah nilai $x$?",
      correctAnswer: "2"
    },
    {
      id: "q_u6",
      type: "multiple_choice",
      content: "Manakah pasangan terurut $(x, y)$ yang merupakan penyelesaian dari $4x + 2y = 12$ dan $2x + 2y = 8$?",
      options: [
        { id: "o1", text: "$(1, 3)$", isCorrect: false },
        { id: "o2", text: "$(2, 2)$", isCorrect: true },
        { id: "o3", text: "$(3, 1)$", isCorrect: false },
        { id: "o4", text: "$(4, 0)$", isCorrect: false }
      ]
    },
    {
      id: "q_u7",
      type: "multiple_choice",
      content: "Nilai $x$ yang memenuhi $3x - 2y = 7$ dan $x + 2y = 5$ adalah ....",
      options: [
        { id: "o1", text: "2", isCorrect: false },
        { id: "o2", text: "3", isCorrect: true },
        { id: "o3", text: "4", isCorrect: false },
        { id: "o4", text: "5", isCorrect: false }
      ]
    },
    {
      id: "q_u8",
      type: "multiple_choice",
      content: "Harga 2 buah buku dan 1 buah pensil adalah Rp8.000, sedangkan harga 1 buah buku dan 2 buah pensil adalah Rp7.000. Harga sebuah buku adalah ....",
      options: [
        { id: "o1", text: "Rp2.000", isCorrect: false },
        { id: "o2", text: "Rp3.000", isCorrect: true },
        { id: "o3", text: "Rp4.000", isCorrect: false },
        { id: "o4", text: "Rp5.000", isCorrect: false }
      ]
    },
    {
      id: "q_u9",
      type: "short_answer",
      content: "Umur Ibu 3 kali umur anak. Selisih umur mereka adalah 26 tahun. Berapakah umur anak?",
      correctAnswer: "13"
    },
    {
      id: "q_u10",
      type: "multiple_choice",
      content: "Diketahui harga 5 kg apel dan 3 kg jeruk Rp79.000, sedangkan harga 3 kg apel dan 2 kg jeruk Rp49.000. Harga 1 kg apel adalah...",
      options: [
        { id: "o1", text: "Rp11.000", isCorrect: true },
        { id: "o2", text: "Rp10.000", isCorrect: false },
        { id: "o3", text: "Rp8.000", isCorrect: false },
        { id: "o4", text: "Rp9.000", isCorrect: false }
      ]
    },
    {
      id: "q_u11",
      type: "multiple_choice",
      content: "Penyelesaian sistem persamaan $x - 3y = 4$ dan $2x + y = 15$ adalah...",
      options: [
        { id: "o1", text: "$x = 7, y = 1$", isCorrect: true },
        { id: "o2", text: "$x = 1, y = 7$", isCorrect: false },
        { id: "o3", text: "$x = 4, y = 0$", isCorrect: false },
        { id: "o4", text: "$x = 5, y = 5$", isCorrect: false }
      ]
    },
    {
      id: "q_u12",
      type: "short_answer",
      content: "Jika $3x + 4y = 24$ dan $x = 4$, tentukan nilai $y$.",
      correctAnswer: "3"
    },
    {
      id: "q_u13",
      type: "multiple_choice",
      content: "Himpunan penyelesaian dari $2x + 5y = 20$ dan $3x - y = 13$ adalah...",
      options: [
        { id: "o1", text: "$(5, 2)$", isCorrect: true },
        { id: "o2", text: "$(2, 5)$", isCorrect: false },
        { id: "o3", text: "$(4, 2)$", isCorrect: false },
        { id: "o4", text: "$(3, 3)$", isCorrect: false }
      ]
    },
    {
      id: "q_u14",
      type: "multiple_choice",
      content: "Nilai $x$ dan $y$ berturut-turut dari $5x - 2y = 4$ dan $6x + y = 15$ adalah...",
      options: [
        { id: "o1", text: "2 dan 3", isCorrect: true },
        { id: "o2", text: "3 dan 2", isCorrect: false },
        { id: "o3", text: "1 dan 4", isCorrect: false },
        { id: "o4", text: "4 dan 1", isCorrect: false }
      ]
    },
    {
      id: "q_u15",
      type: "multiple_choice",
      content: "Jika $x + y = 10$ dan $x - y = 2$, berapakah nilai dari $2x$?",
      options: [
        { id: "o1", text: "6", isCorrect: false },
        { id: "o2", text: "12", isCorrect: true },
        { id: "o3", text: "10", isCorrect: false },
        { id: "o4", text: "8", isCorrect: false }
      ]
    },
    {
      id: "q_u16",
      type: "short_answer",
      content: "Diketahui $4x + y = 9$ dan $2x + 3y = 7$. Berapakah nilai dari $x + y$?",
      correctAnswer: "3"
    },
    {
      id: "q_u17",
      type: "essay",
      content: "Harga 3 buah seragam dan 2 celana adalah Rp280.000. Harga 1 buah seragam dan 3 celana adalah Rp210.000. Tentukan harga 1 buah seragam dan lampirkan cara penyelesaianmu!"
    },
    {
      id: "q_u18",
      type: "multiple_choice",
      content: "Penyelesaian dari $x + 5y = 13$ dan $2x - y = 4$ adalah...",
      options: [
        { id: "o1", text: "$x = 3, y = 2$", isCorrect: true },
        { id: "o2", text: "$x = 2, y = 3$", isCorrect: false },
        { id: "o3", text: "$x = 1, y = 5$", isCorrect: false },
        { id: "o4", text: "$x = 5, y = 1$", isCorrect: false }
      ]
    },
    {
      id: "q_u19",
      type: "essay",
      content: "Jelaskan dengan bahasamu sendiri, langkah-langkah menggunakan metode substitusi untuk menyelesaikan sebuah sistem persamaan linear."
    },
    {
      id: "q_u20",
      type: "essay",
      content: "Selesaikan sistem persamaan $2x + y = 13$ dan $x - y = 5$ menggunakan metode campuran (eliminasi dan substitusi), lalu temukan nilai x dan y! Sertakan foto coretan perhitunganmu."
    }
  ]
};
