﻿using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Polyglot.BusinessLogic.TranslationServices;

namespace Polyglot.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class TranslationController : ControllerBase
    {
        private readonly ITranslatorProvider _provider;

        public TranslationController(ITranslatorProvider provider)
        {
            _provider = provider;
        }

        [HttpPost]
        public async Task<IActionResult> Translate([FromBody]TextForTranslation item)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            return Ok(await _provider.Translate(item));
        }
    }
}
