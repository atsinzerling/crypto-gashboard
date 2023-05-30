using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers;

[ApiController]
[Route("math")]
public class MathController : ControllerBase
{

    private readonly ILogger<MathController> _logger;

    public MathController(ILogger<MathController> logger)
    {
        _logger = logger;
    }

    [HttpGet("multiply")]
    public int Multiply([FromQuery] int a, [FromQuery] int b)
    {
        return a * b;
    }

    [HttpGet("add")]
    public int Add([FromQuery] int a, [FromQuery] int b)
    {
        return a + b;
    }

    [HttpGet("absdiff")]
    public int AbsoluteDifference([FromQuery] int a, [FromQuery] int b)
    {
        return Math.Abs(a - b);
    }


    /*[HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }*/
}
