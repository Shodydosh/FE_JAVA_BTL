import { Product } from '@/types/product';
import useSWRMutation from 'swr/mutation';

const productArray = [
    {
        id: 1,
        url: '/',
        image: 'https://i.pinimg.com/736x/18/84/24/1884248df0286062436ea23d29ef5183.jpg',
        name: 'LAPTOP DELL VOSTRO 5620 (70282719) (I5 1240P 16GB/512GB SSD/16.0FHD+/WIN11/OFFICEHS21/XÁM)',
        info: 'CPU: Intel® Core™ i5-1240P (3.30 GHz up to 4.20 GHz, 12MB)\nRAM: 16GB (2x8GB) DDR4 3200MHz\nỔ cứng: 512GB M.2 PCIe NVMe SSD\nVGA: Intel® Iris® Xe Graphics\nMàn hình: 16.0-inch 16:10 FHD+ (1920 x 1200) Anti-Glare Non-Touch 250nits\nMàu sắc: Xám\nOS: Win 11 Home',
        oldPrice: '22.299.000₫',
        newPrice: '21.999.000đ',
    },
    {
        id: 2,
        url: '/',
        image: 'https://i.pinimg.com/736x/18/84/24/1884248df0286062436ea23d29ef5183.jpg',
        name: 'LAPTOP DELL INSPIRON 5620 (N6I7110W1) (I7 1255U 8GB RAM/512GB SSD/16.0 INCH FHD+/WIN11/OFFICE HS21/BẠC)',
        info: 'CPU: Intel Core i7 1255U (Up to 4.7 Ghz, 18Mb)\nRAM: 8GB DDR4 3200Mhz (2 khe tối đa 32Gb)\nỔ cứng: 512Gb M.2 PCIe NVMe SSD\nVGA: Intel Iris XE graphic\nMàn hình: 16inch FHD (1920 x 1200) Anti-Glare 300 nits\nMàu sắc: Silver\nOS: Windows 11 Home SL + Office Home and Student',
        oldPrice: '22.349.000₫',
        newPrice: '21.999.000₫',
    },
    {
        id: 3,
        url: '/',
        image: 'https://i.pinimg.com/736x/18/84/24/1884248df0286062436ea23d29ef5183.jpg',
        name: 'LAPTOP ASUS GAMING TUF FX507ZC4-HN074W (I5 12500H/8GB RAM/512GB SSD/15.6 FHD 144HZ/RTX 3050 4GB/WIN11/XÁM)',
        info: 'CPU: Intel Core i5-12500H (3.30 GHz upto 4.50 GHz, 18MB)\nRAM: 8GB (1x 8GB) DDR4-3200MHz (2 khe) (Tối đa 32GB)\nỔ cứng: 512GB SSD M.2 2280 PCIe 3.0x4 NVMe (Còn trống 1 khe)\nVGA: NVIDIA GeForce RTX 3050 4GB GDDR6\nMàn hình: 16inch FHD (1920 x 1200) Anti-Glare 300 nits\nMàu sắc: Silver\nOS: Windows 11 Home SL + Office Home and Student',
        oldPrice: '22.349.000₫',
        newPrice: '21.999.000₫',
    },
    {
        id: 4,
        url: '/',
        image: 'https://i.pinimg.com/736x/18/84/24/1884248df0286062436ea23d29ef5183.jpg',
        name: 'LAPTOP ASUS VIVOBOOK K6502VU-MA090W (I9 13900H/16GB RAM/512GB SSD/15.6 2.8K OLED/RTX4050 6GB/WIN11/BẠC)',
        info: 'CPU: Intel Core i7-12500H (3.30 GHz upto 4.50 GHz, 18MB)\nRAM: 8GB (1x 8GB) DDR4-3200MHz (2 khe) (Tối đa 32GB)\nỔ cứng: 512GB SSD M.2 2280 PCIe 3.0x4 NVMe (Còn trống 1 khe)\nVGA: NVIDIA GeForce RTX 3050 4GB GDDR6\nMàn hình: 16inch FHD (1920 x 1200) Anti-Glare 300 nits\nMàu sắc: Silver\nOS: Windows 11 Home SL + Office Home and Student',
        oldPrice: '22.349.000₫',
        newPrice: '20.999.000₫',
    },
    {
        id: 5,
        url: '/',
        image: 'https://i.pinimg.com/736x/18/84/24/1884248df0286062436ea23d29ef5183.jpg',
        name: 'LAPTOP MSI VIVOBOOK K6502VU-MA090W (I9 13900H/16GB RAM/512GB SSD/15.6 2.8K OLED/RTX4050 6GB/WIN11/BẠC)',
        info: 'CPU: Intel Core i7-12500H (3.30 GHz upto 4.50 GHz, 18MB)\nRAM: 8GB (1x 8GB) DDR4-3200MHz (2 khe) (Tối đa 32GB)\nỔ cứng: 512GB SSD M.2 2280 PCIe 3.0x4 NVMe (Còn trống 1 khe)\nVGA: NVIDIA GeForce RTX 3050 4GB GDDR6\nMàn hình: 16inch FHD (1920 x 1200) Anti-Glare 300 nits\nMàu sắc: Silver\nOS: Windows 11 Home SL + Office Home and Student',
        oldPrice: '22.349.000₫',
        newPrice: '20.999.000₫',
    },
    // ... Add more laptop items as needed
] as Product[];

// đầu tiên, useSearchProduct này là một hook được dùng cho việc xử lí logic phần search product, đây là hook giả lập search product
// nếu sau này em có gắn api để lấy product search từ backend thì có một vài chổ em cần sửa lại như sau:

// từ dòng 61 -> 72 sẽ là logic cho axios fetch api hay bất cứ thư viện http request nào khác

export function useSearchProduct() {
    // A useSWR + mutate like API, but it will not start the request automatically.
    return useSWRMutation('/search_product', (_, { arg }: { arg: string }) => {
        if (!arg) return [];

        // giả sử: return axios.get('/api_url', undefined, { params: { search: arg } })
        // ===> http://localhost:3001/api_url?search=iphone19ultraplusmaxultimategold
        // nhớ là phải retur về 1 mảng product nha em dạ vâng cái useSearch nó là custom hook đúng không anh đúng vậy vâng em đi làm cũng dùng qua, đi làm thì chắc chắn phải xử lí logic trong custom hook để clean code, cái này sếp em làm luôn rồi anh ẹ hcahaaahahahah

        const filtersSearchValue = productArray.filter((product: Product) => {
            const { name, info } = product;

            return (
                name.toLowerCase().includes(arg) ||
                info.toLowerCase().includes(arg)
            );
        });

        return filtersSearchValue;
    });
}
