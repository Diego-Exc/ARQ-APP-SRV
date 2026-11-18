import { Errors } from "../../../../shared/http-error";
import { TechnicianProfileRepository } from "../../domain/ports/TechnicianProfileRepository";

export class SetAvailability {
  constructor(private readonly profiles: TechnicianProfileRepository) {}

  execute(technicianId: string, online: boolean): void {
    const profile = this.profiles.findById(technicianId);
    if (!profile) throw Errors.notFound("Perfil de técnico no encontrado");
    profile.online = online;
    this.profiles.save(profile);
  }
}
