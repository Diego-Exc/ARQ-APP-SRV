import { ClassifiableTrade } from "../../domain/services/DamageClassifier";

export interface TradeCatalogPort {
  listClassifiableTrades(): ClassifiableTrade[];
}
