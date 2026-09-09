export class EnvionmentUtils {
  static getPort() {
    return import.meta.env.VITE_PORT || 5000;
  }

  static getHost() {
    return import.meta.VITE_HOST || 'localhost';
  }

  static getBaseUrl() {
    return `http://${this.getHost()}:${this.getPort()}/`;
  }
}
