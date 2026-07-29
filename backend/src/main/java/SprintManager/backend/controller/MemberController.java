package SprintManager.backend.controller;

import SprintManager.backend.model.Member;
import SprintManager.backend.service.MemberService;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {
    private final MemberService memberService ;
    public  MemberController(MemberService memberService){ this.memberService = memberService;}

    @GetMapping
    public List<Member> getAll(){return  memberService.getAll();}

    @GetMapping("/{id}")
    public  Member getById(@PathVariable Long id ){ return memberService.getById(id);}

    @PostMapping(consumes = "application/json")
    public Member create(@RequestBody Member member){return  memberService.create(member); }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        boolean delete = memberService.delete(id);
        return delete? "Miembro borrado.": "Miembro no encontrado.";
    }
}
