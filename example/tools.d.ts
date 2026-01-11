declare namespace functions {
  // Gets the location of the user.
  type get_location = () => string;
  // Gets the current weather in the provided location.
  type get_current_weather = (_: {
    // The city and state, e.g. San Francisco, CA
    location: string;
    format?: "celsius" | "fahrenheit"; // default: celsius
  }) => any;
  // Gets the current weather in the provided list of locations.
  type get_multiple_weathers = (_: {
    // List of city and state, e.g. ["San Francisco, CA", "New York, NY"]
    locations: string[];
    format?: "celsius" | "fahrenheit"; // default: celsius
  }) => any;
} // namespace functions
