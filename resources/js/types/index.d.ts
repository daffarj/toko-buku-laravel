export interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    cover: string;
    inStock: boolean;
    stock: number;
    isbn: string;
    publisher: string;
    year: number;
    pages: number;
    language: string;
    description: string;
    synopsis: string;
}

export interface CartItem {
    book: Book;
    quantity: number;
}

export const BOOK_IMAGES = {
    fiction:
        "https://images.unsplash.com/photo-1760696473709-a7da66ee87a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    education:
        "https://images.unsplash.com/photo-1725869973689-425c74f79a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    biography:
        "https://images.unsplash.com/photo-1769963121626-7f1885db412c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    comic: "https://images.unsplash.com/photo-1588497859490-85d1c17db96d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    library:
        "https://images.unsplash.com/photo-1709924168698-620ea32c3488?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
};

export const books: Book[] = [
    {
        id: "1",
        title: "Laskar Pelangi",
        author: "Andrea Hirata",
        category: "Fiksi",
        price: 85000,
        originalPrice: 110000,
        rating: 4.8,
        reviewCount: 2341,
        cover: BOOK_IMAGES.fiction,
        inStock: true,
        stock: 45,
        isbn: "978-979-1411-47-1",
        publisher: "Bentang Pustaka",
        year: 2005,
        pages: 534,
        language: "Indonesia",
        description: "Novel",
        synopsis:
            "Novel Laskar Pelangi mengisahkan tentang sepuluh anak kampung yang berjuang menuntut ilmu di sekolah yang hampir roboh di Pulau Belitung. Dengan tekad dan semangat yang membara, mereka membuktikan bahwa mimpi tidak mengenal batas ekonomi.",
    },
    {
        id: "2",
        title: "Atomic Habits: Perubahan Kecil yang Memberikan Hasil Luar Biasa",
        author: "James Clear",
        category: "Non-Fiksi",
        price: 120000,
        rating: 4.9,
        reviewCount: 5892,
        cover: BOOK_IMAGES.education,
        inStock: true,
        stock: 12,
        isbn: "978-602-6417-75-4",
        publisher: "Gramedia Pustaka Utama",
        year: 2019,
        pages: 320,
        language: "Indonesia",
        description: "Self-help / Pengembangan Diri",
        synopsis:
            "Atomic Habits mengajarkan cara membangun kebiasaan baik dan menghilangkan kebiasaan buruk dengan perubahan kecil namun konsisten. James Clear menjelaskan sistem yang terbukti ilmiah untuk membentuk identitas baru dan mencapai tujuan.",
    },
    {
        id: "3",
        title: "Sapiens: Riwayat Singkat Umat Manusia",
        author: "Yuval Noah Harari",
        category: "Non-Fiksi",
        price: 145000,
        rating: 4.7,
        reviewCount: 3210,
        cover: BOOK_IMAGES.biography,
        inStock: true,
        stock: 8,
        isbn: "978-602-424-033-9",
        publisher: "Kepustakaan Populer Gramedia",
        year: 2017,
        pages: 484,
        language: "Indonesia",
        description: "Sejarah / Antropologi",
        synopsis:
            "Sapiens menelusuri perjalanan manusia dari hominid purba hingga penguasa dunia modern. Harari menjelaskan bagaimana revolusi kognitif, pertanian, dan ilmu pengetahuan membentuk peradaban yang kita kenal hari ini.",
    },
    {
        id: "4",
        title: "One Piece Vol. 100",
        author: "Eiichiro Oda",
        category: "Komik",
        price: 35000,
        rating: 5.0,
        reviewCount: 8901,
        cover: BOOK_IMAGES.comic,
        inStock: true,
        stock: 100,
        isbn: "978-4-08-882233-5",
        publisher: "Elex Media Komputindo",
        year: 2021,
        pages: 200,
        language: "Indonesia",
        description: "Manga / Komik",
        synopsis:
            "Volume ke-100 dari manga legendaris One Piece. Luffy dan awakening Gear Fifth-nya menghadapi Kaido di puncak Onigashima dalam pertarungan epik yang menentukan nasib Wano.",
    },
    {
        id: "5",
        title: "Matematika untuk SMA Kelas XII",
        author: "B.K. Noormandiri",
        category: "Edukasi",
        price: 95000,
        rating: 4.3,
        reviewCount: 1205,
        cover: BOOK_IMAGES.education,
        inStock: true,
        stock: 30,
        isbn: "978-979-461-902-1",
        publisher: "Erlangga",
        year: 2022,
        pages: 368,
        language: "Indonesia",
        description: "Buku Pelajaran",
        synopsis:
            "Buku pelajaran matematika yang komprehensif untuk siswa SMA kelas XII, mencakup materi limit fungsi, turunan, integral, serta statistika dan peluang sesuai kurikulum Merdeka.",
    },
    {
        id: "6",
        title: "Steve Jobs",
        author: "Walter Isaacson",
        category: "Biografi",
        price: 130000,
        originalPrice: 160000,
        rating: 4.6,
        reviewCount: 4567,
        cover: BOOK_IMAGES.biography,
        inStock: false,
        stock: 0,
        isbn: "978-602-03-1498-4",
        publisher: "Mizan",
        year: 2011,
        pages: 656,
        language: "Indonesia",
        description: "Biografi",
        synopsis:
            "Biografi resmi Steve Jobs yang ditulis berdasarkan lebih dari 40 wawancara eksklusif dengan Jobs sendiri selama dua tahun, serta wawancara dengan lebih dari 100 keluarga, teman, musuh, pesaing, dan koleganya.",
    },
    {
        id: "7",
        title: "Bumi",
        author: "Tere Liye",
        category: "Fiksi",
        price: 79000,
        rating: 4.5,
        reviewCount: 3456,
        cover: BOOK_IMAGES.fiction,
        inStock: true,
        stock: 25,
        isbn: "978-602-291-024-6",
        publisher: "Gramedia Pustaka Utama",
        year: 2014,
        pages: 440,
        language: "Indonesia",
        description: "Novel Fantasi",
        synopsis:
            "Raib, gadis berusia 15 tahun, memiliki kemampuan menghilang. Bersama sahabatnya, ia menjelajahi dunia paralel yang tersembunyi di balik realitas yang kita kenal dalam petualangan fantasi yang mendebarkan.",
    },
    {
        id: "8",
        title: "Rich Dad Poor Dad",
        author: "Robert T. Kiyosaki",
        category: "Non-Fiksi",
        price: 88000,
        rating: 4.4,
        reviewCount: 6789,
        cover: BOOK_IMAGES.library,
        inStock: true,
        stock: 18,
        isbn: "978-979-685-887-1",
        publisher: "Gramedia Pustaka Utama",
        year: 2000,
        pages: 336,
        language: "Indonesia",
        description: "Keuangan Pribadi",
        synopsis:
            "Rich Dad Poor Dad mengubah paradigma tentang uang dan investasi. Kiyosaki berbagi pelajaran dari dua ayah yang berbeda pandangan tentang kekayaan, mengajarkan cara kerja uang yang sebenarnya.",
    },
    {
        id: "9",
        title: "Naruto Vol. 72 - Tamat",
        author: "Masashi Kishimoto",
        category: "Komik",
        price: 28000,
        rating: 4.9,
        reviewCount: 12045,
        cover: BOOK_IMAGES.comic,
        inStock: true,
        stock: 50,
        isbn: "978-602-9-19523-3",
        publisher: "Elex Media Komputindo",
        year: 2015,
        pages: 192,
        language: "Indonesia",
        description: "Manga",
        synopsis:
            "Volume terakhir dari saga Naruto Uzumaki. Ninja muda yang bermimpi menjadi Hokage akhirnya mencapai tujuannya dalam pertarungan terakhir yang penuh emosi dan pengorbanan.",
    },
    {
        id: "10",
        title: "Biologi Molekuler untuk Mahasiswa",
        author: "Dr. Achmad Surjana",
        category: "Edukasi",
        price: 175000,
        rating: 4.1,
        reviewCount: 312,
        cover: BOOK_IMAGES.education,
        inStock: true,
        stock: 6,
        isbn: "978-602-7600-31-4",
        publisher: "Penerbit ITB",
        year: 2020,
        pages: 520,
        language: "Indonesia",
        description: "Buku Teks Universitas",
        synopsis:
            "Panduan komprehensif biologi molekuler untuk mahasiswa tingkat sarjana dan pascasarjana, mencakup struktur DNA, ekspresi gen, rekayasa genetika, dan bioteknologi modern.",
    },
    {
        id: "11",
        title: "Habibie & Ainun",
        author: "B.J. Habibie",
        category: "Biografi",
        price: 99000,
        originalPrice: 120000,
        rating: 4.8,
        reviewCount: 7234,
        cover: BOOK_IMAGES.biography,
        inStock: true,
        stock: 20,
        isbn: "978-979-656-950-5",
        publisher: "THC Mandiri",
        year: 2009,
        pages: 326,
        language: "Indonesia",
        description: "Autobiografi / Roman",
        synopsis:
            "Kisah cinta abadi antara B.J. Habibie dan Ainun Besari yang ditulis langsung oleh sang Presiden. Sebuah memoir yang mengharukan tentang perjalanan hidup, perjuangan, dan cinta yang melampaui batas kematian.",
    },
    {
        id: "12",
        title: "Perahu Kertas",
        author: "Dee Lestari",
        category: "Fiksi",
        price: 72000,
        rating: 4.6,
        reviewCount: 4123,
        cover: BOOK_IMAGES.fiction,
        inStock: true,
        stock: 33,
        isbn: "978-979-780-514-3",
        publisher: "Bentang Pustaka",
        year: 2009,
        pages: 444,
        language: "Indonesia",
        description: "Novel Romansa",
        synopsis:
            "Kugy dan Keenan, dua jiwa yang berbeda namun saling terhubung. Novel yang menceritakan perjalanan cinta, mimpi, dan pencarian jati diri di tengah arus kehidupan yang tak terduga.",
    },
];

export const categories = [
    "Semua",
    "Fiksi",
    "Non-Fiksi",
    "Edukasi",
    "Komik",
    "Biografi",
];

export const adminOrders = [
    {
        id: "#TK-20260001",
        customer: "Budi Santoso",
        total: 205000,
        status: "Dikirim",
        date: "14 Apr 2026",
    },
    {
        id: "#TK-20260002",
        customer: "Siti Rahayu",
        total: 120000,
        status: "Diproses",
        date: "14 Apr 2026",
    },
    {
        id: "#TK-20260003",
        customer: "Andi Wijaya",
        total: 340000,
        status: "Selesai",
        date: "13 Apr 2026",
    },
    {
        id: "#TK-20260004",
        customer: "Dewi Kusuma",
        total: 88000,
        status: "Menunggu",
        date: "13 Apr 2026",
    },
    {
        id: "#TK-20260005",
        customer: "Reza Pratama",
        total: 215000,
        status: "Dibatalkan",
        date: "12 Apr 2026",
    },
];

export const formatRupiah = (amount: number): string => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
};
