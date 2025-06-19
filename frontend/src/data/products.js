// src/data/products.js
import ransel1_hitam from "../assets/ransel1_hitam.png";
import kpr1_maroon from "../assets/kpr1_maroon.png";
import kpr1_rosegold from "../assets/kpr1_rosegold.png";
import kpr1_silver from "../assets/kpr1_silver.png";
import slp1_hitam from "../assets/slp1_hitam.png";
import slp2 from "../assets/slp2.png";
import slp2_hitam from "../assets/slp2_hitam.png";
import slp2_coklat from "../assets/slp2_coklat.png";
import slp2_biru from "../assets/slp2_biru.png";
import kpr2_hitam from "../assets/kpr2_hitam.png";
import kpr2_biru from "../assets/kpr2_biru.png";
import kpr2_ungu from "../assets/kpr2_ungu.png";
import kpr2_abu from "../assets/kpr2_abu.png";
import ransel2 from "../assets/ransel2.png";
import ransel22 from "../assets/ransel22.png";
import ransel222 from "../assets/ransel222.png";
import slp3_hitam from "../assets/slp3_hitam.png";
import slp3_hijau from "../assets/slp3_hijau.png";
import kpr4 from "../assets/kpr4.png";
import kpr444 from "../assets/kpr444.png";
import kpr4_rosegold from "../assets/kpr4_rosegold.png";
import kpr4_maroon from "../assets/kpr4_maroon.png";
import kpr4_biru from "../assets/kpr4_biru.png";
import ransel3 from "../assets/ransel3.png";
import ransel33 from "../assets/ransel33.png";
import kpr5_hitam from "../assets/kpr5_hitam.png";
import kpr5_abu from "../assets/kpr5_abu.png";
import kpr5_rosegold from "../assets/kpr5_rosegold.png";
import kpr6_coklat from "../assets/kpr6_coklat.png";
import kpr6_hitam from "../assets/kpr6_hitam.png";
import kpr6_biru from "../assets/kpr6_biru.png";


export const initialProducts = [
  {
    id: 1,
    name: "TAS RANSEL LAPTOP BACKPACK PRESIDENT WATERPROOF",
    price: 265000,
    variants: [
      { color: "hitam", stock: 100, image: ransel1_hitam },
    ],
  },
  {
    id: 2,
    name: "KOPER FIBER 24 INCI TSA LOCK PREMIUM SAVAGE BAGASI SIZE",
    price: 365000,
    variants: [
      { color: "silver", stock: 501, image: kpr1_silver },
      { color: "rosegold", stock: 300, image: kpr1_rosegold },
      { color: "maroon", stock: 100, image: kpr1_maroon },
    ],
  },
  {
    id: 3,
    name: "TAS SELEMPANG BAHU WATERPROOF / ANTI AIR FASHION PRIA DAN WANITA POLO LAND",
    price: 110000,
    variants: [
      { color: "hitam", stock: 501, image: slp1_hitam },
    ],
  },
  {
    id: 4,
    name: "TAS SELEMPANG BAHU BAHAN KANVAS TEBAL PREMIUM SLINGBAG LEGUM",
    price: 235000,
    variants: [
      { color: "Hitam", stock: 50, image: slp2_hitam },
      { color: "Biru", stock: 30, image: slp2_biru },
      { color: "Coklat", stock: 20, image: slp2_coklat },
    ],
  },
 {
    id: 5,
    name: "KOPER FIBER KARET ELASTIS LENTUR ANTI PECAH POLYPROPYLENE SAVAGE EKSPLEY",
    price: 395000,
    variants: [
      { color: "Hitam", stock: 50, image: kpr2_hitam },
      { color: "Biru", stock: 30, image: kpr2_biru },
      { color: "ungu", stock: 20, image: kpr2_ungu },
      { color: "abu", stock: 20, image: kpr2_abu },
    ],
  },
{
    id: 6,
    name: "KOPER FIBER KARET ELASTIS LENTUR ANTI PECAH POLYPROPYLENE SAVAGE EKSPLEY",
    price: 395000,
    variants: [
      { color: "Hitam", stock: 50, image: ransel2 },
      { color: "", stock: 30, image:  ransel22} ,
      { color: "", stock: 20, image: ransel222 },
    ],
  },
  {
    id: 7,
    name: "TAS SELEMPANG MINI OFFICIAL PANIC ARMY STYLE",
    price: 25000,
    variants: [
      { color: "Hitam", stock: 50, image: slp3_hitam },
      { color: "Hijau", stock: 30, image:  slp3_hijau} ,
      
    ],
  },
  {
    id: 8,
    name: "Koper Jumbo Fiber 28 Inci Anti Pecah Premium",
    price: 350000,
    variants: [
      { color: "", stock: 50, image: kpr4 },
      { color: "", stock: 30, image: kpr444} ,
      { color: "rosegold", stock: 50, image: kpr4_rosegold },
      { color: "biru", stock: 30, image:  kpr4_biru} ,
      { color: "maroon", stock: 30, image:  kpr4_maroon} ,
      
      
    ],
  },
  {
    id: 9,
    name: "TAS RANSEL LAPTOP MULTIFUNGSI 3 IN 1 / TAS RANSEL SELEMPANG JINJING",
    price: 99900,
    variants: [
      { color: "", stock: 500, image: ransel3 },
      { color: "", stock: 0, image: ransel33} ,    
    ],
  },
{
    id: 10,
    name: "KOPER SUPER JUMBO 32 INCI TSA LOCK BAHAN POLYPROPYLENE LENTUR ANTI PECAH",
    price: 850000,
    variants: [
      { color: "Hitam", stock: 50, image: kpr5_hitam },
      { color: "abu", stock: 30, image: kpr5_abu },
      { color: "rosegold", stock: 20, image: kpr5_rosegold },
      
    ],
  },
  {
    id: 11,
    name: "Koper Presiden 32 Inci SUPER SUPER JUMBO BAHAN KANVAS",
    price: 980000,
    variants: [
      { color: "coklat", stock: 50, image: kpr6_coklat },
      { color: "hitam", stock: 30, image: kpr6_hitam},
      { color: "biru", stock: 20, image: kpr6_biru },
      
    ],
  },
];
