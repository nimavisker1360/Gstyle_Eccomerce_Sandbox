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
  Button,
} from "@react-email/components";

import { formatToman } from "@/lib/utils";
import { IOrder } from "@/lib/db/models/order.model";
import { SERVER_URL } from "@/lib/constants";

type OrderInformationProps = {
  order: IOrder;
};

AdminOrderNotificationEmail.PreviewProps = {
  order: {
    _id: "64f7b8c9e1234567890abcd",
    items: [
      {
        name: "محصول نمونه",
        slug: "sample-product",
        image: "https://example.com/image.jpg",
        price: 150000,
        quantity: 2,
        size: "L",
        color: "آبی",
        note: "این یک یادداشت نمونه است",
      },
    ],
    totalPrice: 300000,
    user: { email: "user@example.com" },
    createdAt: new Date(),
  } as IOrder,
};

const safeFormatDate = (date: Date | string | undefined) => {
  if (!date) return "نامشخص";
  try {
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "نامشخص";
  }
};

export default function AdminOrderNotificationEmail({
  order,
}: OrderInformationProps) {
  if (!order) {
    return (
      <Html>
        <Body>
          <Text>اطلاعات سفارش در دسترس نیست</Text>
        </Body>
      </Html>
    );
  }

  try {
    const orderId = order._id?.toString() || "N/A";
    const createdAt = safeFormatDate(order.createdAt);
    const totalPrice = order.totalPrice || 0;
    const items = Array.isArray(order.items) ? order.items : [];
    const userEmail =
      typeof order.user === "object" &&
      order.user !== null &&
      "email" in order.user
        ? (order.user as any).email
        : "نامشخص";

    return (
      <Html>
        <Preview>سفارش جدید دریافت شد</Preview>
        <Tailwind>
          <Head />
          <Body className="font-sans bg-white" dir="rtl">
            <Container className="mx-auto py-8 px-4">
              <Section className="bg-white border border-gray-200 rounded-lg p-6">
                <Heading className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  🎉 سفارش جدید دریافت شد
                </Heading>

                <Section className="bg-blue-50 p-4 rounded-lg mb-6">
                  <Row>
                    <Column>
                      <Text className="text-sm text-gray-600">
                        شماره سفارش:
                      </Text>
                      <Text className="text-lg font-bold text-gray-900">
                        {orderId}
                      </Text>
                    </Column>
                    <Column>
                      <Text className="text-sm text-gray-600">
                        تاریخ سفارش:
                      </Text>
                      <Text className="text-lg font-bold text-gray-900">
                        {createdAt}
                      </Text>
                    </Column>
                  </Row>
                  <Row className="mt-4">
                    <Column>
                      <Text className="text-sm text-gray-600">
                        ایمیل مشتری:
                      </Text>
                      <Text className="text-lg font-bold text-gray-900">
                        {userEmail}
                      </Text>
                    </Column>
                    <Column>
                      <Text className="text-sm text-gray-600">مبلغ کل:</Text>
                      <Text className="text-lg font-bold text-green-600">
                        {formatToman(totalPrice)}
                      </Text>
                    </Column>
                  </Row>
                </Section>

                <Heading className="text-xl font-semibold text-gray-900 mb-4">
                  📦 محصولات سفارش شده:
                </Heading>

                {items.map((item, index) => (
                  <Section
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 mb-4"
                  >
                    <Row>
                      <Column className="w-20">
                        <Img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </Column>
                      <Column className="flex-1">
                        <Text className="font-semibold text-gray-900 mb-2">
                          {item.name}
                        </Text>
                        <Row className="text-sm text-gray-600">
                          <Column>
                            <Text>تعداد: {item.quantity}</Text>
                          </Column>
                          <Column>
                            <Text>قیمت: {formatToman(item.price)}</Text>
                          </Column>
                        </Row>
                        {item.size && (
                          <Text className="text-sm text-gray-600">
                            سایز: {item.size}
                          </Text>
                        )}
                        {item.color && (
                          <Text className="text-sm text-gray-600">
                            رنگ: {item.color}
                          </Text>
                        )}
                        {item.note && (
                          <Section className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <Text className="text-sm font-semibold text-yellow-800 mb-1">
                              💬 توضیحات/سوال مشتری:
                            </Text>
                            <Text className="text-sm text-yellow-700">
                              {item.note}
                            </Text>
                          </Section>
                        )}
                      </Column>
                    </Row>

                    <Section className="mt-4 text-center space-y-2">
                      <Button
                        href={`${SERVER_URL}/product/${item.slug}`}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        🔗 مشاهده محصول
                      </Button>

                      {item.note && (
                        <div className="text-xs text-gray-500 mt-2">
                          <Text>این محصول دارای توضیحات/سوال از مشتری است</Text>
                        </div>
                      )}
                    </Section>
                  </Section>
                ))}

                <Section className="mt-6 text-center">
                  <Button
                    href={`${SERVER_URL}/admin/orders/${orderId}`}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700"
                  >
                    📋 مدیریت سفارش
                  </Button>
                </Section>

                <Section className="mt-6 text-center text-sm text-gray-500">
                  <Text>
                    این ایمیل به صورت خودکار پس از ثبت سفارش جدید ارسال شده است.
                  </Text>
                  <Text className="mt-2">
                    برای مشاهده جزئیات کامل، روی دکمه &quot;مشاهده محصول&quot;
                    کلیک کنید.
                  </Text>
                </Section>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  } catch (error) {
    return (
      <Html>
        <Body>
          <Text>خطا در نمایش اطلاعات سفارش</Text>
        </Body>
      </Html>
    );
  }
}
