export const INITIAL_LKPD = [
  {
    id: 'lkpd_1',
    materiId: 'mat_1',
    title: 'LKPD',
    subtitle: 'Sistem Persamaan Linear Dua Variabel',
    coverPreset: 'fruits',
    isDeleted: false,
    deletedAt: null,

    blocks: [
      {
        id: 'b1',
        step: 1,
        title: 'Ayo temukan polanya !',
        subtitle: '',
        icon: 'Search',
        type: 'text',
        imageUrl: '',
        content:
`Pada toko buah, 2 mangga dan 1 apel berharga Rp24.000.
Sementara, 1 mangga dan 2 apel berharga Rp15.000.

Menurut kalian, berapa harga 1 mangga dan 1 apel?`,
        inputs: []
      },

      {
        id: 'b2',
        step: 2,
        title: 'Eksplorasi',
        subtitle: 'Membangun model matematika',
        icon: 'PenTool',
        type: 'input_group',
        imageUrl: '',
        content:
`Pemisalan :

🟡 mangga (x)
🔴 apel (y)

sehingga :`,
        inputs: [
          {
            id: 'i1',
            label: 'Bagaimana menentukan x dan y?',
            type: 'textarea'
          }
        ]
      },

      {
        id: 'b3',
        step: 3,
        title: 'Berpikir Kritis',
        subtitle: 'Menemukan Konsep',
        icon: 'Lightbulb',
        type: 'highlight',
        imageUrl: '',
        content:
`Apa yang ditemukan?

Dalam eksplorasi, kita memiliki dua persamaan yang melibatkan dua variabel. Bentuk inilah yang disebut sistem persamaan linear dua variabel (SPLDV).`,
        inputs: []
      },

      {
        id: 'b4',
        step: 4,
        title: 'Penyelesaian',
        subtitle: 'Temukan x dan y',
        icon: 'Calculator',
        type: 'input_group',
        imageUrl: '',
        content:
`Gunakan metode campuran (Eliminasi & Substitusi)`,
        inputs: [
          {
            id: 'i2',
            label: 'Tuliskan langkah penyelesaianmu:',
            type: 'textarea'
          }
        ]
      },

      {
        id: 'b5',
        step: 5,
        title: 'Refleksi',
        subtitle: '',
        icon: 'MessageCircle',
        type: 'input_group',
        imageUrl: '',
        content: '',
        inputs: [
          {
            id: 'i3',
            label: '1. Informasi apa yang kalian dapatkan?',
            type: 'text'
          },
          {
            id: 'i4',
            label: '2. Bagaimana cara menentukan harga masing-masing?',
            type: 'text'
          },
          {
            id: 'i5',
            label: '3. Apa itu SPLDV?',
            type: 'text'
          }
        ]
      }
    ]
  }
];