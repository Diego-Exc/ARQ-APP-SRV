import { Errors } from "../../../../shared/http-error";
import { TechnicianProfileRepository } from "../../domain/ports/TechnicianProfileRepository";

export class SetAvailability {
  constructor(private readonly profiles: TechnicianProfileRepository) {}

  async execute(technicianId: string, online: boolean): Promise<void> {
    const profile = await this.profiles.findById(technicianId);
    if (!profile) throw Errors.notFound("Perfil de técnico no encontrado");
    profile.online = online;
    await this.profiles.save(profile);
  }
}
