import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { formatToman } from "@/lib/utils";
import { ITransaction } from "@/lib/db/models/transaction.model";
import { SERVER_URL } from "@/lib/constants";

type ZarinPalInvoiceProps = {
  transaction: ITransaction;
  refId: string | number;
  authority: string;
};

ZarinPalInvoiceEmail.PreviewProps = {
  transaction: {
    _id: "123",
    amount: 1000000, // 100,000 Rial = 10,000 Toman
    customer: {
      firstName: "علی",
      lastName: "احمدی",
      email: "ali@example.com",
      phone: "09123456789",
      address: "تهران، خیابان ولیعصر، پلاک 123",
    },
    products: [
      {
        productId: "prod1",
        name: "محصول نمونه",
        slug: "sample-product",
        image: "/images/product1.jpg",
        price: 500000, // 50,000 Rial = 5,000 Toman
        quantity: 2,
        size: "L",
        color: "آبی",
        note: "توضیحات محصول",
      },
    ],
    orderId: "ORD-001",
    createdAt: new Date(),
  } as ITransaction,
  refId: "123456789",
  authority: "AUTH-001",
};

export default function ZarinPalInvoiceEmail({
  transaction,
  refId,
  authority,
}: ZarinPalInvoiceProps) {
  if (!transaction) {
    return (
      <Html>
        <Body>
          <Text>اطلاعات تراکنش در دسترس نیست</Text>
        </Body>
      </Html>
    );
  }

  try {
    const orderId = transaction.orderId || "نامشخص";
    const createdAt = new Date(transaction.createdAt).toLocaleDateString(
      "fa-IR"
    );
    const amountRial = transaction.amount || 0;
    const amountToman = Math.floor(amountRial / 10);
    const fullName =
      `${transaction.customer?.firstName || ""} ${
        transaction.customer?.lastName || ""
      }`.trim() || "نامشخص";
    const customerEmail = transaction.customer?.email || "";
    const customerPhone = transaction.customer?.phone || "";
    const customerAddress = transaction.customer?.address || "";
    const products = transaction.products || [];

    return (
      <Html dir="rtl" lang="fa">
        <Preview>فاکتور پرداخت موفق - سفارش {orderId}</Preview>
        <Tailwind>
          <Head />
          <Body className="font-sans bg-gray-50 text-gray-900">
            <Container className="max-w-2xl mx-auto p-6">
              {/* Header */}
              <Section className="bg-green-600 text-white p-6 rounded-t-lg text-center">
                <Heading className="text-2xl font-bold m-0">
                  ✅ پرداخت موفق
                </Heading>
                <Text className="text-lg m-0 mt-2">
                  سفارش شما با موفقیت ثبت و پرداخت شد
                </Text>
              </Section>

              {/* Order Info Card */}
              <Section className="bg-white p-6 border border-gray-200">
                <Heading className="text-xl font-bold text-gray-800 mb-4 text-center">
                  📋 اطلاعات سفارش
                </Heading>

                <Row className="mb-3">
                  <Column className="w-1/2">
                    <Text className="text-gray-600 text-sm">شماره سفارش:</Text>
                  </Column>
                  <Column className="w-1/2">
                    <Text className="font-semibold">{orderId}</Text>
                  </Column>
                </Row>

                <Row className="mb-3">
                  <Column className="w-1/2">
                    <Text className="text-gray-600 text-sm">تاریخ سفارش:</Text>
                  </Column>
                  <Column className="w-1/2">
                    <Text className="font-semibold">{createdAt}</Text>
                  </Column>
                </Row>

                <Row className="mb-3">
                  <Column className="w-1/2">
                    <Text className="text-gray-600 text-sm">
                      کد رهگیری زرین‌پال:
                    </Text>
                  </Column>
                  <Column className="w-1/2">
                    <Text className="font-semibold font-mono">{authority}</Text>
                  </Column>
                </Row>

                <Row className="mb-3">
                  <Column className="w-1/2">
                    <Text className="text-gray-600 text-sm">شماره تراکنش:</Text>
                  </Column>
                  <Column className="w-1/2">
                    <Text className="font-semibold font-mono">{refId}</Text>
                  </Column>
                </Row>

                <Row className="mb-3">
                  <Column className="w-1/2">
                    <Text className="text-gray-600 text-sm">مبلغ کل:</Text>
                  </Column>
                  <Column className="w-1/2">
                    <Text className="font-bold text-green-600 text-lg">
                      {formatToman(amountToman)}
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Customer Info Card */}
              <Section className="bg-white p-6 border border-gray-200 mt-4">
                <Heading className="text-xl font-bold text-gray-800 mb-4 text-center">
                  👤 اطلاعات مشتری
                </Heading>

                <Row className="mb-3">
                  <Column className="w-1/2">
                    <Text className="text-gray-600 text-sm">
                      نام و نام خانوادگی:
                    </Text>
                  </Column>
                  <Column className="w-1/2">
                    <Text className="font-semibold">{fullName}</Text>
                  </Column>
                </Row>

                <Row className="mb-3">
                  <Column className="w-1/2">
                    <Text className="text-gray-600 text-sm">ایمیل:</Text>
                  </Column>
                  <Column className="w-1/2">
                    <Text className="font-semibold">{customerEmail}</Text>
                  </Column>
                </Row>

                <Row className="mb-3">
                  <Column className="w-1/2">
                    <Text className="text-gray-600 text-sm">شماره تلفن:</Text>
                  </Column>
                  <Column className="w-1/2">
                    <Text className="font-semibold">{customerPhone}</Text>
                  </Column>
                </Row>

                <Row className="mb-3">
                  <Column className="w-1/2">
                    <Text className="text-gray-600 text-sm">آدرس:</Text>
                  </Column>
                  <Column className="w-1/2">
                    <Text className="font-semibold">{customerAddress}</Text>
                  </Column>
                </Row>
              </Section>

              {/* Products Card */}
              <Section className="bg-white p-6 border border-gray-200 mt-4">
                <Heading className="text-xl font-bold text-gray-800 mb-4 text-center">
                  🛍️ محصولات سفارش شده
                </Heading>

                {products.map((product, index) => {
                  const productPriceRial = product.price || 0;
                  const productPriceToman = Math.floor(productPriceRial / 10);
                  const totalProductPriceToman =
                    productPriceToman * (product.quantity || 1);

                  return (
                    <Section
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 mb-4"
                    >
                      <Row>
                        <Column className="w-20">
                          <Img
                            width="80"
                            height="80"
                            alt={product.name}
                            className="rounded-lg object-cover"
                            src={
                              product.image?.startsWith("/")
                                ? `${SERVER_URL}${product.image}`
                                : product.image ||
                                  "https://via.placeholder.com/80"
                            }
                          />
                        </Column>
                        <Column className="pl-4">
                          <Text className="font-bold text-lg mb-2">
                            {product.name}
                          </Text>

                          <Row className="mb-2">
                            <Column className="w-1/2">
                              <Text className="text-gray-600 text-sm">
                                تعداد:
                              </Text>
                            </Column>
                            <Column className="w-1/2">
                              <Text className="font-semibold">
                                {product.quantity}
                              </Text>
                            </Column>
                          </Row>

                          {product.size && (
                            <Row className="mb-2">
                              <Column className="w-1/2">
                                <Text className="text-gray-600 text-sm">
                                  سایز:
                                </Text>
                              </Column>
                              <Column className="w-1/2">
                                <Text className="font-semibold">
                                  {product.size}
                                </Text>
                              </Column>
                            </Row>
                          )}

                          {product.color && (
                            <Row className="mb-2">
                              <Column className="w-1/2">
                                <Text className="text-gray-600 text-sm">
                                  رنگ:
                                </Text>
                              </Column>
                              <Column className="w-1/2">
                                <Text className="font-semibold">
                                  {product.color}
                                </Text>
                              </Column>
                            </Row>
                          )}

                          {product.note && (
                            <Row className="mb-2">
                              <Column className="w-1/2">
                                <Text className="text-gray-600 text-sm">
                                  توضیحات:
                                </Text>
                              </Column>
                              <Column className="w-1/2">
                                <Text className="font-semibold text-blue-600">
                                  {product.note}
                                </Text>
                              </Column>
                            </Row>
                          )}

                          <Row className="mb-2">
                            <Column className="w-1/2">
                              <Text className="text-gray-600 text-sm">
                                قیمت واحد:
                              </Text>
                            </Column>
                            <Column className="w-1/2">
                              <Text className="font-semibold">
                                {formatToman(productPriceToman)}
                              </Text>
                            </Column>
                          </Row>

                          <Row>
                            <Column className="w-1/2">
                              <Text className="text-gray-600 text-sm">
                                قیمت کل:
                              </Text>
                            </Column>
                            <Column className="w-1/2">
                              <Text className="font-bold text-green-600">
                                {formatToman(totalProductPriceToman)}
                              </Text>
                            </Column>
                          </Row>
                        </Column>
                      </Row>
                    </Section>
                  );
                })}
              </Section>

              {/* Total Summary Card */}
              <Section className="bg-green-50 p-6 border border-green-200 mt-4 rounded-lg">
                <Row>
                  <Column className="w-1/2">
                    <Text className="text-lg font-bold text-gray-800">
                      جمع کل سفارش:
                    </Text>
                  </Column>
                  <Column className="w-1/2 text-left">
                    <Text className="text-2xl font-bold text-green-600">
                      {formatToman(amountToman)}
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Footer */}
              <Section className="bg-gray-100 p-6 rounded-b-lg text-center mt-4">
                <Text className="text-gray-600 text-sm mb-2">
                  این ایمیل به صورت خودکار پس از تایید پرداخت ارسال شده است
                </Text>
                <Text className="text-gray-600 text-sm mb-2">
                  در صورت بروز مشکل، با پشتیبانی تماس بگیرید
                </Text>
                <Text className="text-gray-500 text-xs">
                  © 2024 GStyle. تمامی حقوق محفوظ است.
                </Text>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  } catch (error) {
    console.error("Error rendering ZarinPal invoice email:", error);
    return (
      <Html>
        <Body>
          <Text>خطا در نمایش فاکتور</Text>
        </Body>
      </Html>
    );
  }
}
