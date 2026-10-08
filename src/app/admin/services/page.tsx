import { ServicesRepository } from "@/repositories/services-repository";
import ServicesClient from "./services-client";

export const metadata = {
  title: "Service Catalogue | Admin",
};

export default async function AdminServicesPage() {
  const services = await ServicesRepository.getTopLevelServices({ limit: 100 });

  return <ServicesClient initialServices={services} />;
}
