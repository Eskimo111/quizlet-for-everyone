import { JsonConvert, JsonCustomConvert } from "json2typescript";

export abstract class JsonSerializer<T extends Object> {
  protected abstract get classReference(): new () => T;

  fromJson(json: Object): T {
    let jsonConvert = new JsonConvert();
    const value = jsonConvert.deserializeObject<T>(json, this.classReference);
    return value;
  }
}

export class EnumConverter<T> implements JsonCustomConvert<T> {
  validValues: string[];
  isOptional = false;

  constructor(
    private enumType: unknown,
    private enumName: string,
    isOptional?: boolean
  ) {
    this.isOptional = isOptional ?? false;
    this.validValues = Object.values(
      Object.getOwnPropertyDescriptors(enumType)
    ).map((value) => value.value);
  }

  deserialize(value: string): T {
    if (!this.validValues.includes(value)) {
      if (!this.isOptional) {
        throw new Error(
          `JsonConvert error; invalid value for enum ${this.enumName}, expected one of '${this.validValues}', found '${value}'`
        );
      }
    }
    return value as unknown as T;
  }

  serialize(data: T): any {
    return data;
  }
}
